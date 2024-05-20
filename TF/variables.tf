variable "name" {
  type        = string
  description = "Name of the project"
}

variable "aws_account_id" {
  type        = string
  description = "The ID of your AWS account"

  validation {
    condition     = can(regex("^[0-9]{12}$", var.aws_account_id))
    error_message = "The aws_account_id must be a 12 digit number."
  }
}
variable "email_domain" {
  type = string

  description = "The domain name to use for the email service."

  # validation {
  #   condition     = can(regex("^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$", var.email_domain))
  #   error_message = "Needs to be a valid domain name."
  # }
}

variable "api_domain" {
  type        = string
  description = "The domain name to use for the API service."
}

variable "hosted_zone_id" {
  type        = string
  description = "The ID of the public hosted zone in route53"
}

variable "env" {
  type        = string
  description = "The environment to deploy to"
}
