locals {
  api_domain = var.api_domain
}

resource "aws_api_gateway_rest_api" "api_gw" {
  name        = "test-${var.env}"
  description = "My test API from TF"
}

module "newAddress" {
  source = "./modules/api_gw_path"

  path_name   = "newAddress"
  api_gw      = aws_api_gateway_rest_api.api_gw
  parent_path = null

  methods = [
    {
      method        = "POST"
      authorization = "NONE"
      lambda        = aws_lambda_function.create_address
    },
  ]
}

module "get_mails" {
  source = "./modules/api_gw_path"

  path_name   = "getMails"
  api_gw      = aws_api_gateway_rest_api.api_gw
  parent_path = null

  methods = [{
    method        = "GET"
    authorization = "NONE"
    lambda        = aws_lambda_function.get_mails
  }]
}

module "get_singed_url" {
  source = "./modules/api_gw_path"

  path_name   = "getSingedUrls"
  api_gw      = aws_api_gateway_rest_api.api_gw
  parent_path = null

  methods = [{
    method        = "GET"
    authorization = "NONE"
    lambda        = aws_lambda_function.get_singed_url
  }]
}

module "delete" {
  source = "./modules/api_gw_path"

  path_name   = "delete"
  api_gw      = aws_api_gateway_rest_api.api_gw
  parent_path = null

  methods = [{
    method        = "DELETE"
    authorization = "NONE"
    lambda        = aws_lambda_function.delete
  }]
}

module "extend_time" {
  source = "./modules/api_gw_path"

  path_name   = "extendTime"
  api_gw      = aws_api_gateway_rest_api.api_gw
  parent_path = null

  methods = [{
    method        = "PUT"
    authorization = "NONE"
    lambda        = aws_lambda_function.extend_time
  }]
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on  = [module.newAddress, module.delete, module.extend_time, module.get_mails, module.get_singed_url]
  rest_api_id = aws_api_gateway_rest_api.api_gw.id

  triggers = {
    redeployment = filesha1("apigw.tf")
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "dev" {
  deployment_id = aws_api_gateway_deployment.deploy.id
  rest_api_id   = aws_api_gateway_rest_api.api_gw.id
  stage_name    = "dev"
}

# --- ACM for custom Domain ---

resource "aws_acm_certificate" "api_cert" {
  provider          = aws.us_east_1
  domain_name       = local.api_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# resource "aws_route53_record" "api_cert" {
#   allow_overwrite = true
#   name            = tolist(aws_acm_certificate.api_cert.domain_validation_options)[0].resource_record_name
#   records         = [tolist(aws_acm_certificate.api_cert.domain_validation_options)[0].resource_record_value]
#   type            = tolist(aws_acm_certificate.api_cert.domain_validation_options)[0].resource_record_type
#   zone_id         = var.hosted_zone_id
#   ttl             = 60
# }

resource "aws_route53_record" "api_cert" {
  depends_on = [aws_acm_certificate.api_cert]
  for_each = {
    for dvo in aws_acm_certificate.api_cert.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = var.hosted_zone_id
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "api_cert" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.api_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert : record.fqdn]
}

resource "aws_api_gateway_domain_name" "api_domain" {
  certificate_arn = aws_acm_certificate_validation.api_cert.certificate_arn
  domain_name     = local.api_domain
}

resource "aws_api_gateway_base_path_mapping" "api_domain" {
  api_id      = aws_api_gateway_rest_api.api_gw.id
  stage_name  = aws_api_gateway_stage.dev.stage_name
  domain_name = aws_api_gateway_domain_name.api_domain.domain_name
}

# --- Route 53 Custom domain ---

resource "aws_route53_record" "api_gw" {
  zone_id = var.hosted_zone_id
  type    = "CNAME"
  ttl     = "300"
  name    = local.api_domain
  records = [aws_api_gateway_domain_name.api_domain.cloudfront_domain_name]
}


output "api_gw_url" {
  value = aws_api_gateway_stage.dev.invoke_url
}


