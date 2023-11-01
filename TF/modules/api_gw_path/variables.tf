variable "region" {
  default = "eu-west-1"
}

variable "path_name" {
  type = string
}

variable "api_gw" {
  type = object({
    root_resource_id = string
    id               = string
    execution_arn    = string
  }) # aws_api_gateway_rest_api.api_gw
}

variable "methods" {
  type = list(object({
    method        = string
    authorization = string # API GW authorizer
    lambda = object({
      invoke_arn    = string
      function_name = string
    }) # aws_lambda_function.lambda_function
  }))
  nullable = true
}

variable "parent_path" {
  type     = string
  default  = null
  nullable = true
}
