#CORS

resource "aws_api_gateway_method" "options_method" {
  rest_api_id = var.api_gw.id
  resource_id = aws_api_gateway_resource.this.id

  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = var.api_gw.id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = 200
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  depends_on = [aws_api_gateway_method.options_method]
}
resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = var.api_gw.id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.options_method.http_method
  type        = "MOCK"
  depends_on  = [aws_api_gateway_method.options_method]

  request_templates = { "application/json" = <<EOF
{"statusCode": 200}
  EOF
  }
}
resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = var.api_gw.id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = aws_api_gateway_method_response.options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_method_response.options_200]
}
