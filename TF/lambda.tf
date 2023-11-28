resource "aws_s3_bucket" "lambda_zips_s3" {
  bucket        = "${var.email_domain}-lambda-zips"
  force_destroy = true
}

# Lambda Layers

data "archive_file" "utils_layer" {
  type             = "zip"
  source_dir       = "../lambda/layers/utils/"
  output_file_mode = "0666"
  output_path      = ".terraform/zips/utils_layer.zip"
}

locals {
  utils_layer_folder_hash = sha256(join("", [for f in fileset("../lambda/layers/utils", "*") : filesha256("../lambda/layers/utils/${f}")]))
}

resource "aws_s3_object" "utils_layer" {
  bucket = aws_s3_bucket.lambda_zips_s3.bucket
  #Need to calculate hash from files in folder insted to zip becuse we get diffrent hash on zip when running CI/CD
  key    = "utils_layer-${local.utils_layer_folder_hash}.zip"
  source = data.archive_file.utils_layer.output_path
}

resource "aws_lambda_layer_version" "utils_layer" {
  s3_bucket  = aws_s3_object.utils_layer.bucket
  s3_key     = aws_s3_object.utils_layer.key
  layer_name = "utils_layer"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["arm64", "x86_64"]
}

data "archive_file" "requirements_layer" {
  type             = "zip"
  source_dir       = "../lambda/layers/requirements"
  output_file_mode = "0666"
  output_path      = ".terraform/zips/requirements_layer.zip"
}

locals {
  requirements_layer_folder_hash = sha256(join("", [for f in fileset("../lambda/layers/requirements", "*") : filesha256("../lambda/layers/requirements/${f}")]))
}

resource "aws_s3_object" "requirements_layer" {
  bucket = aws_s3_bucket.lambda_zips_s3.bucket
  #Need to calculate hash from files in folder insted to zip becuse we get diffrent hash on zip when running CI/CD
  key    = "requirements_layer-${local.requirements_layer_folder_hash}.zip"
  source = data.archive_file.requirements_layer.output_path
}

resource "aws_lambda_layer_version" "requirements_layer" {
  s3_bucket  = aws_s3_object.requirements_layer.bucket
  s3_key     = aws_s3_object.requirements_layer.key
  layer_name = "requirements_layer"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

# Function to create a new email address
data "archive_file" "create_address" {
  type             = "zip"
  source_dir       = "../lambda/create_address/"
  output_file_mode = "0664"
  output_path      = ".terraform/zips/create_address.zip"
}

resource "aws_lambda_function" "create_address" {
  filename      = ".terraform/zips/create_address.zip"
  function_name = "create_address"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.create_address.output_base64sha256

  runtime       = "python3.11"
  layers        = [aws_lambda_layer_version.utils_layer.arn, aws_lambda_layer_version.requirements_layer.arn]
  architectures = ["x86_64"]
  timeout       = 30
  memory_size   = 512

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.inbox_now.name
      DOMAIN     = var.email_domain
    }
  }
}

resource "aws_cloudwatch_log_group" "create_address" {
  name              = "/aws/lambda/${aws_lambda_function.create_address.function_name}"
  retention_in_days = 7
}

# Function to recive, scan and save emails from SES to S3
data "archive_file" "save_mail" {
  type             = "zip"
  source_dir       = "../lambda/save_mail/"
  output_file_mode = "0664"
  output_path      = ".terraform/zips/save_mail.zip"
}
resource "aws_lambda_function" "save_mail" {
  filename      = ".terraform/zips/save_mail.zip"
  function_name = "save_mail"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.save_mail.output_base64sha256

  runtime = "python3.11"
  layers  = [aws_lambda_layer_version.utils_layer.arn]

  environment {
    variables = {
      TABLE_NAME  = aws_dynamodb_table.inbox_now.name
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
  type             = "zip"
  source_dir       = "../lambda/check_address/"
  output_file_mode = "0664"
  output_path      = ".terraform/zips/check_address.zip"
}

resource "aws_lambda_function" "check_address" {
  filename      = ".terraform/zips/check_address.zip"
  function_name = "check_address"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.check_address.output_base64sha256

  runtime = "python3.11"
  layers  = [aws_lambda_layer_version.utils_layer.arn]

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.inbox_now.name
    }
  }
}

resource "aws_cloudwatch_log_group" "check_address" {
  name              = "/aws/lambda/${aws_lambda_function.check_address.function_name}"
  retention_in_days = 7
}

#Function to get emails for an address
data "archive_file" "get_mails" {
  type             = "zip"
  source_dir       = "../lambda/get_mails/"
  output_file_mode = "0664"
  output_path      = ".terraform/zips/get_mails.zip"
}

resource "aws_lambda_function" "get_mails" {
  filename      = ".terraform/zips/get_mails.zip"
  function_name = "get_mails"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.get_mails.output_base64sha256

  runtime = "python3.11"
  layers  = [aws_lambda_layer_version.utils_layer.arn]

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.inbox_now.name
    }
  }
}

resource "aws_cloudwatch_log_group" "get_mails" {
  name              = "/aws/lambda/${aws_lambda_function.get_mails.function_name}"
  retention_in_days = 7
}

#Function to create signed S3 URLs to download emails
data "archive_file" "get_singed_url" {
  type             = "zip"
  source_dir       = "../lambda/get_singed_url/"
  output_file_mode = "0664"
  output_path      = ".terraform/zips/get_singed_url.zip"
}

resource "aws_lambda_function" "get_singed_url" {
  filename      = ".terraform/zips/get_singed_url.zip"
  function_name = "get_singed_url"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.get_singed_url.output_base64sha256

  runtime = "python3.11"
  layers  = [aws_lambda_layer_version.utils_layer.arn]

  environment {
    variables = {
      TABLE_NAME  = aws_dynamodb_table.inbox_now.name
      BUCKET_NAME = aws_s3_bucket.saved_mails.id
    }
  }
}

resource "aws_cloudwatch_log_group" "get_singed_url" {
  name              = "/aws/lambda/${aws_lambda_function.get_singed_url.function_name}"
  retention_in_days = 7
}

#Function to delete address and emails
data "archive_file" "delete" {
  type             = "zip"
  source_dir       = "../lambda/delete/"
  output_file_mode = "0664"
  output_path      = ".terraform/zips/delete.zip"
}

resource "aws_lambda_function" "delete" {
  filename      = ".terraform/zips/delete.zip"
  function_name = "delete"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.delete.output_base64sha256

  runtime = "python3.11"
  layers  = [aws_lambda_layer_version.utils_layer.arn]

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.inbox_now.name
    }
  }
}

resource "aws_cloudwatch_log_group" "delete" {
  name              = "/aws/lambda/${aws_lambda_function.delete.function_name}"
  retention_in_days = 7
}

#Function to extend address time
data "archive_file" "extend_time" {
  type             = "zip"
  source_dir       = "../lambda/extend_time/"
  output_file_mode = "0664"
  output_path      = ".terraform/zips/extend_time.zip"
}

resource "aws_lambda_function" "extend_time" {
  filename      = ".terraform/zips/extend_time.zip"
  function_name = "extend_time"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.extend_time.output_base64sha256

  runtime       = "python3.11"
  layers        = [aws_lambda_layer_version.utils_layer.arn, aws_lambda_layer_version.requirements_layer.arn]
  architectures = ["x86_64"]
  timeout       = 30
  memory_size   = 1024

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.inbox_now.name
    }
  }
}

resource "aws_cloudwatch_log_group" "extend_time" {
  name              = "/aws/lambda/${aws_lambda_function.extend_time.function_name}"
  retention_in_days = 7
}

#Function to delete on ddb ttl expiration
data "archive_file" "ddb_delete" {
  type             = "zip"
  source_dir       = "../lambda/ddb_delete/"
  output_file_mode = "0644"
  output_path      = ".terraform/zips/ddb_delete.zip"
}

resource "aws_lambda_function" "ddb_delete" {
  filename      = ".terraform/zips/ddb_delete.zip"
  function_name = "ddb_delete"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"

  source_code_hash = data.archive_file.ddb_delete.output_base64sha256

  runtime = "python3.11"
  layers  = [aws_lambda_layer_version.utils_layer.arn]
  timeout = 30

  environment {
    variables = {
      TABLE_NAME  = aws_dynamodb_table.inbox_now.name
      BUCKET_NAME = aws_s3_bucket.saved_mails.id
    }
  }
}

resource "aws_lambda_event_source_mapping" "ddb_delete" {
  event_source_arn  = aws_dynamodb_table.inbox_now.stream_arn
  function_name     = aws_lambda_function.ddb_delete.arn
  starting_position = "LATEST"

  filter_criteria {
    filter {
      pattern = "{ \"eventName\" : [ \"REMOVE\" ] }"
    }
  }
}

resource "aws_cloudwatch_log_group" "ddb_delete" {
  name              = "/aws/lambda/${aws_lambda_function.ddb_delete.function_name}"
  retention_in_days = 1
}

output "utils_hash" {
  value = data.archive_file.utils_layer.output_base64sha256
}

output "create_address_hash" {
  value = data.archive_file.create_address.output_base64sha256
}
