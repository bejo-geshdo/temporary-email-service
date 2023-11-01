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
