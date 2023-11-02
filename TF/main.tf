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