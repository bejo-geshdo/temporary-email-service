// WS API GW

resource "aws_apigatewayv2_api" "ws_api_gw" {
  name                       = "test-websocket-${var.env}"
  description = "My test WS API from TF"

  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
  disable_execute_api_endpoint = false //TODO Set to true when we have a custom domain
}


resource "aws_apigatewayv2_stage" "stage" {
  api_id = aws_apigatewayv2_api.ws_api_gw.id
  name   = "prod"
  auto_deploy = true
}

resource "aws_apigatewayv2_deployment" "deployment" {
  api_id      = aws_apigatewayv2_api.ws_api_gw.id
  description = "Deployment for stage prod"
  triggers = {
    edeployment = filesha1("ws_apigw.tf")
  }
  
}

// Connet lambda

//Give permission for API GW to invoke lambda
resource "aws_lambda_permission" "connect" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws_connect.function_name
  principal     = "apigateway.amazonaws.com"
  //Find out if source_arn is corret for WS
  source_arn    = "${aws_apigatewayv2_api.ws_api_gw.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "example" {
  api_id           = aws_apigatewayv2_api.ws_api_gw.id
  integration_type = "AWS_PROXY" 
  
  # connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  description               = "Lambda example"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.ws_connect.invoke_arn
  //passthrough_behavior      = "WHEN_NO_MATCH"
  }

resource "aws_apigatewayv2_route" "connect_route" {
  api_id    = aws_apigatewayv2_api.ws_api_gw.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.example.id}"
}


// Disconnect lambda
//Give permission for API GW to invoke lambda
resource "aws_lambda_permission" "disconnect" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws_disconnect.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ws_api_gw.execution_arn}/*"
}

resource "aws_apigatewayv2_integration" "disconnect" {
  api_id           = aws_apigatewayv2_api.ws_api_gw.id
  integration_type = "AWS_PROXY" 
  
  # connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  description               = "Lambda example"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.ws_disconnect.invoke_arn
  //passthrough_behavior      = "WHEN_NO_MATCH"
  }

resource "aws_apigatewayv2_route" "disconnect_route" {
  api_id    = aws_apigatewayv2_api.ws_api_gw.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.disconnect.id}"
}

// Push mails lambda

// Custom domain
// Regional cert?