resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com",
        },
      },
    ],
  })
}

resource "aws_iam_policy" "dynamodb_full_access" {
  name        = "dynamodb_full_access"
  description = "Provides full access to DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "dynamodb:*",
        Resource = "*",
      },
    ],
  })
}

resource "aws_iam_policy" "ses_full_access" {
  name        = "ses_full_access"
  description = "Provides full access to SES"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "ses:*",
        Resource = "*",
      },
    ],
  })
}

resource "aws_iam_policy" "ses_s3_access" {
  name        = "ses_s3_access"
  description = "Provides access to the bucket with mails"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "*"
        Resource = "${aws_s3_bucket.saved_mails.arn}*"
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_logs" {
  name        = "lambda_logs"
  description = "Allows functions to write logs to CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_full_access" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.dynamodb_full_access.arn
}

resource "aws_iam_role_policy_attachment" "lambda_ses_full_access" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.ses_full_access.arn
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_logs.arn
}

resource "aws_iam_role_policy_attachment" "ses_s3" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.ses_s3_access.arn
}

data "archive_file" "create_address" {
  type        = "zip"
  source_dir  = "../lambda/api/"
  output_path = ".terraform/zips/create_address.zip"
}

resource "aws_lambda_function" "create_address" {
  filename      = ".terraform/zips/create_address.zip"
  function_name = "create_address2"
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

data "archive_file" "check_address" {
  type = "zip"
  source_dir = "../lambda/api/"
  output_path = ".terraform/zips/check_address.zip"
}

resource "aws_lambda_function" "check_address" {
  filename      = ".terraform/zips/check_address.zip"
  function_name = "check_address2"
  role          = aws_iam_role.lambda_role.arn
  handler       = "check_address.lambda_handler"

  source_code_hash = data.archive_file.check_address.output_base64sha256

  runtime = "python3.11"

  environment {
    variables = {
      TABLE_NAME  = "email"
    }
  }
}

resource "aws_cloudwatch_log_group" "check_address" {
  name              = "/aws/lambda/${aws_lambda_function.check_address.function_name}"
  retention_in_days = 7
}