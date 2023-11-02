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

locals {
  allowed_methods = ["GET", "POST", "ANY", "PUT", "DELETE", "HEAD", "OPTIONS", "ANY"]

  validated_methods = [for m in var.methods : {
    method        = m.method
    authorization = m.authorization
    lambda        = m.lambda
    valid         = contains(local.allowed_methods, m.method) ? true : false
  }]

  invalid_methods = [for m in local.validated_methods : m if !m.valid]
}

resource "null_resource" "validate_methods" {
  count = length(local.invalid_methods) > 0 ? 1 : 0

  provisioner "local-exec" {
    command = "echo 'Invalid method(s) detected: ${join(", ", [for m in local.invalid_methods : m.method])}' && exit 1"
  }
}

variable "parent_path" {
  type     = string
  default  = null
  nullable = true
}
