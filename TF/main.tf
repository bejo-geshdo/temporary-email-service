terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.23.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region  = "eu-west-1"
  profile = "bejo-privat"
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "saved_mails" {
  bucket        = "mail.castrojonsson.se-ses"
  force_destroy = true
}

resource "aws_dynamodb_table" "inbox_now" {
  name         = "inbox_now"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  # ttl {
  #   attribute_name = "ttl"
  #   enabled        = false #TODO Enable when lambda is set up to trigger on delete
  # }

  deletion_protection_enabled = false #TODO Enable
}