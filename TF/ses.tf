resource "aws_ses_domain_identity" "main" {
  domain = var.email_domain
}

resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

output "route53" {
  value = aws_ses_domain_dkim.main
}

resource "aws_route53_record" "ses_dkim_record" {
  count   = 3
  zone_id = var.hosted_zone_id
  name    = "${aws_ses_domain_dkim.main.dkim_tokens[count.index]}._domainkey.${var.email_domain}"
  type    = "CNAME"
  ttl     = "300"
  records = ["${aws_ses_domain_dkim.main.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

resource "aws_route53_record" "ses_mx_record" {
  zone_id = var.hosted_zone_id
  name = var.email_domain
  type = "MX"
  ttl = "300"
  records = ["10 inbound-smtp.eu-west-1.amazonaws.com"]
}

resource "aws_route53_record" "ses_txt_record" {
  zone_id = var.hosted_zone_id
  name = var.email_domain
  type = "TXT"
  ttl = "300"
  records = ["v=spf1 include:amazonses.com ~all"]
}

resource "aws_ses_domain_mail_from" "main" {
  domain = aws_ses_domain_identity.main.domain
  mail_from_domain = "bounce.${aws_ses_domain_identity.main.domain}"
}

resource "aws_route53_record" "ses_from_mx_record" {
  zone_id = var.hosted_zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "MX"
  ttl     = "300"
  records = ["10 feedback-smtp.eu-west-1.amazonses.com"] # Change to the region in which `aws_ses_domain_identity.example` is created
}

resource "aws_route53_record" "ses_from_txt_record" {
  zone_id = var.hosted_zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "TXT"
  ttl     = "300"
  records = ["v=spf1 include:amazonses.com -all"]
} 

resource "aws_ses_receipt_rule_set" "main" {
  depends_on = [ aws_route53_record.ses_dkim_record, aws_route53_record.ses_mx_record  ]
  rule_set_name = "main"
}

resource "aws_lambda_permission" "allow_ses_check_address" {
  statement_id   = "AllowExecutionFromSES"
  action         = "lambda:InvokeFunction"
  function_name  = aws_lambda_function.check_address.function_name
  source_account = data.aws_caller_identity.current.account_id
  principal      = "ses.amazonaws.com"
}

resource "aws_ses_receipt_rule" "check_address" {
  depends_on    = [aws_lambda_permission.allow_ses_check_address]
  name          = "check_address"
  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name

  recipients   = [var.email_domain]
  enabled      = true
  scan_enabled = true

  lambda_action {
    position        = 1
    function_arn    = aws_lambda_function.check_address.arn
    invocation_type = "RequestResponse"
  }

  bounce_action {
    position = 2

    message         = "Mailbox does not exist"
    sender          = "no-reply@${aws_ses_domain_mail_from.main.mail_from_domain}"
    smtp_reply_code = "550"
    status_code     = "5.1.1"
  }

  stop_action {
    position = 3

    scope = "RuleSet"
  }
}

resource "aws_lambda_permission" "allow_ses_save_mail" {
  statement_id   = "AllowExecutionFromSES"
  action         = "lambda:InvokeFunction"
  function_name  = aws_lambda_function.save_mail.function_name
  source_account = data.aws_caller_identity.current.account_id
  principal      = "ses.amazonaws.com"
}

data "aws_iam_policy_document" "allow_ses_to_write_s3" {

  # Allow ses to write into s3 bucket
  statement {
    sid = "AllowSESToWriteIntoReportsBucket"
    principals {
      type = "Service"
      identifiers = [
        "ses.amazonaws.com"
      ]
    }
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.saved_mails.id}/*"
    ]
    condition {
      test     = "StringEquals"
      variable = "aws:Referer"
      values   = ["${data.aws_caller_identity.current.account_id}"]
    }
  }
}

resource "aws_s3_bucket_policy" "reports" {
  bucket = aws_s3_bucket.saved_mails.id
  policy = data.aws_iam_policy_document.allow_ses_to_write_s3.json
}

resource "aws_ses_receipt_rule" "s3" {
  depends_on    = [aws_lambda_permission.allow_ses_save_mail, aws_s3_bucket_policy.reports]
  name          = "s3"
  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name
  after         = aws_ses_receipt_rule.check_address.name

  recipients = [var.email_domain]
  enabled    = true

  s3_action {
    position    = 1
    bucket_name = aws_s3_bucket.saved_mails.id
  }

  lambda_action {
    position = 2

    function_arn    = aws_lambda_function.save_mail.arn
    invocation_type = "RequestResponse" #Maybe change to "Event"
  }

  stop_action {
    position = 3

    scope = "RuleSet"
  }

}

resource "aws_ses_active_receipt_rule_set" "main" {
  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name
}