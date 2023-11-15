# Path
resource "aws_api_gateway_resource" "this" {
  parent_id   = var.parent_path == null ? var.api_gw.root_resource_id : var.parent_path
  path_part   = var.path_name
  rest_api_id = var.api_gw.id
}

#Methods

resource "aws_api_gateway_method" "this" {
  count       = length(var.methods)
  rest_api_id = var.api_gw.id
  resource_id = aws_api_gateway_resource.this.id

  http_method   = var.methods[count.index].method
  authorization = var.methods[count.index].authorization
}

# Integrations
resource "aws_api_gateway_integration" "this" {
  count       = length(var.methods)
  rest_api_id = var.api_gw.id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.this[count.index].http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.methods[count.index].lambda.invoke_arn
}

#Access to Lambda from API
resource "aws_lambda_permission" "this" {
  count         = length(var.methods)
  function_name = var.methods[count.index].lambda.function_name
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gw.execution_arn}/*" # Consider locking this down to method and path
}
