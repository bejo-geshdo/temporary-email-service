# Function to create a new email address
data "archive_file" "create_address" {
  type        = "zip"
  source_dir  = "../lambda/api/"
  output_path = ".terraform/zips/create_address.zip"
}

resource "aws_lambda_function" "create_address" {
  filename      = ".terraform/zips/create_address.zip"
  function_name = "create_address"
  role          = aws_iam_role.lambda_role.arn
  handler       = "create_address.lambda_handler"

  source_code_hash = data.archive_file.create_address.output_base64sha256

  runtime = "python3.11"

  environment {
    variables = {
      TABLE_NAME = "email"
    }
  }
}

resource "aws_cloudwatch_log_group" "create_address" {
  name              = "/aws/lambda/${aws_lambda_function.create_address.function_name}"
  retention_in_days = 7
}

# Function to recive, scan and save emails from SES to S3
data "archive_file" "save_mail" {
  type        = "zip"
  source_dir  = "../lambda/api/"
  output_path = ".terraform/zips/save_mail.zip"
}
resource "aws_lambda_function" "save_mail" {
  filename      = ".terraform/zips/create_address.zip"
  function_name = "save_mail"
  role          = aws_iam_role.lambda_role.arn
  handler       = "save_mail.lambda_handler"

  source_code_hash = data.archive_file.save_mail.output_base64sha256

  runtime = "python3.11"

  environment {
    variables = {
      TABLE_NAME  = "email"
      BUCKET_NAME = aws_s3_bucket.saved_mails.id
    }
  }
}

resource "aws_cloudwatch_log_group" "save_mail" {
  name              = "/aws/lambda/${aws_lambda_function.save_mail.function_name}"
  retention_in_days = 7
}

# Function to check if a email address exists and is active
data "archive_file" "check_address" {
  type        = "zip"
  source_dir  = "../lambda/api/"
  output_path = ".terraform/zips/check_address.zip"
}

resource "aws_lambda_function" "check_address" {
  filename      = ".terraform/zips/check_address.zip"
  function_name = "check_address"
  role          = aws_iam_role.lambda_role.arn
  handler       = "check_address.lambda_handler"

  source_code_hash = data.archive_file.check_address.output_base64sha256

  runtime = "python3.11"

  environment {
    variables = {
      TABLE_NAME = "email"
    }
  }
}

resource "aws_cloudwatch_log_group" "check_address" {
  name              = "/aws/lambda/${aws_lambda_function.check_address.function_name}"
  retention_in_days = 7
}

#Function to get emails for an address
data "archive_file" "get_mails" {
  type        = "zip"
  source_dir  = "../lambda/api/"
  output_path = ".terraform/zips/get_mails.zip"
}

resource "aws_lambda_function" "get_mails" {
  filename      = ".terraform/zips/check_address.zip"
  function_name = "get_mails"
  role          = aws_iam_role.lambda_role.arn
  handler       = "get_mails.lambda_handler"

  source_code_hash = data.archive_file.get_mails.output_base64sha256

  runtime = "python3.11"

  environment {
    variables = {
      TABLE_NAME = "email"
    }
  }
}

resource "aws_cloudwatch_log_group" "get_mails" {
  name              = "/aws/lambda/${aws_lambda_function.get_mails.function_name}"
  retention_in_days = 7
}

#Function to create signed S3 URLs to download emails
data "archive_file" "get_singed_url" {
  type        = "zip"
  source_dir  = "../lambda/api/"
  output_path = ".terraform/zips/get_singed_url.zip"
}

resource "aws_lambda_function" "get_singed_url" {
  filename      = ".terraform/zips/get_singed_url.zip"
  function_name = "get_singed_url"
  role          = aws_iam_role.lambda_role.arn
  handler       = "get_singed_url.lambda_handler"

  source_code_hash = data.archive_file.get_singed_url.output_base64sha256

  runtime = "python3.11"

  environment {
    variables = {
      TABLE_NAME  = "email"
      BUCKET_NAME = aws_s3_bucket.saved_mails.id
    }
  }
}

resource "aws_cloudwatch_log_group" "get_singed_url" {
  name              = "/aws/lambda/${aws_lambda_function.get_singed_url.function_name}"
  retention_in_days = 7
}