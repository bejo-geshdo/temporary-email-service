resource "aws_api_gateway_rest_api" "api_gw" {
  name        = "test"
  description = "My test API from TF"
}

module "newAddress" {
  source = "./modules/api_gw_path"

  path_name   = "newAddress"
  api_gw      = aws_api_gateway_rest_api.api_gw
  parent_path = null

  methods = [{
    method        = "GET"
    authorization = "NONE"
    lambda        = aws_lambda_function.create_address
  }]
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


output "api_gw_url_prod" {
  value = aws_api_gateway_stage.dev.invoke_url
}

