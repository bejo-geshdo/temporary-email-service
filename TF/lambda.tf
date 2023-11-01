data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "../lambda/api/"
  output_path = ".terraform/zips/lambda_test.zip"
}

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

resource "aws_iam_policy" "lambda_logs" {
  name        = "lambda_logs"
  description = "Allows functions to write logs to CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
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


resource "aws_lambda_function" "lambda_function" {
  filename      = ".terraform/zips/lambda_test.zip"
  function_name = "test_tf_lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "create_address.lambda_handler"

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  runtime = "python3.11"

  environment {
    variables = {
      TABLE_NAME = "email"
    }
  }
}