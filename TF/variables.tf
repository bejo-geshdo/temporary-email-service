variable "name" {
  type        = string
  description = "Name of the project"
}

variable "aws_account_id" {
  type        = string
  description = "The ID of your AWS account"
  default     = "275567994947"

  validation {
    condition     = can(regex("^[0-9]{12}$", var.aws_account_id))
    error_message = "The aws_account_id must be a 12 digit number."
  }
}
variable "email_domain" {
  type = string

  # validation {
  #   condition     = can(regex("^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$", var.email_domain))
  #   error_message = "Needs to be a valid domain name."
  # }
}

variable "hosted_zone_id" {
  type = string
}

variable "env" {
  type = string
}
