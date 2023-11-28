terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.23.0"
    }
  }

  backend "s3" {
    bucket = "tf-state-833095292836"
    region = "eu-west-1"
    key    = "state"
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "eu-west-1"
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "saved_mails" {
  bucket        = "${var.email_domain}-ses"
  force_destroy = true
}

resource "aws_s3_bucket_cors_configuration" "s3_cors" {
  bucket = aws_s3_bucket.saved_mails.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_dynamodb_table" "inbox_now" {
  name             = "inbox_now"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "pk"
  range_key        = "sk"
  stream_enabled   = true
  stream_view_type = "OLD_IMAGE"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  deletion_protection_enabled = false #TODO Enable
}
