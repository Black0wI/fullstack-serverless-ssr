# ============================================
# TECH PORTAL — TERRAFORM INFRASTRUCTURE
# S3 + CloudFront + OAC + CloudFront Functions
# ============================================

terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.34"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

# US-East-1 provider (required for CloudFront + ACM)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = var.tags
  }
}

# ── Data Sources ──

data "aws_caller_identity" "current" {}

# ── S3 Bucket (Static Assets) ──

resource "aws_s3_bucket" "static" {
  bucket = "${var.project_name}-${var.environment}-static"

  tags = {
    Name = "${var.project_name}-${var.environment}-static"
  }
}

resource "aws_s3_bucket_versioning" "static" {
  bucket = aws_s3_bucket.static.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket = aws_s3_bucket.static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static" {
  bucket = aws_s3_bucket.static.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ── CloudFront Origin Access Control ──

resource "aws_cloudfront_origin_access_control" "static" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "OAC for ${var.project_name} static site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ── S3 Bucket Policy (CloudFront-only access) ──

resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.static.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.static.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.static.arn
          }
        }
      }
    ]
  })
}

# ── CloudFront Function (URL Rewrite) ──

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.project_name}-${var.environment}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite URLs for Next.js static export"
  publish = true
  code    = file("${path.module}/cloudfront-functions/url-rewrite.js")
}

# ── CloudFront Function (Security Headers) ──

resource "aws_cloudfront_function" "security_headers" {
  name    = "${var.project_name}-${var.environment}-security-headers"
  runtime = "cloudfront-js-2.0"
  comment = "Add security headers (CSP, HSTS, X-Frame-Options)"
  publish = true
  code    = file("${path.module}/cloudfront-functions/security-headers.js")
}

# ── CloudFront Distribution ──

resource "aws_cloudfront_distribution" "static" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.project_name} (${var.environment})"
  price_class         = var.cloudfront_price_class
  aliases             = var.domain_name != "" ? [var.domain_name] : []
  wait_for_deployment = false

  origin {
    domain_name              = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id                = "s3-static"
    origin_access_control_id = aws_cloudfront_origin_access_control.static.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-static"

    # Managed cache policy: CachingOptimized
    cache_policy_id          = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    origin_request_policy_id = null
    compress                 = true
    viewer_protocol_policy   = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }

    function_association {
      event_type   = "viewer-response"
      function_arn = aws_cloudfront_function.security_headers.arn
    }
  }

  # Cache static assets aggressively
  ordered_cache_behavior {
    path_pattern     = "_next/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-static"

    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Error pages
  custom_error_response {
    error_code         = 403
    response_code      = 404
    response_page_path = "/404/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.domain_name == "" ? true : false
    acm_certificate_arn            = var.domain_name != "" ? var.acm_certificate_arn : null
    minimum_protocol_version       = "TLSv1.2_2021"
    ssl_support_method             = var.domain_name != "" ? "sni-only" : null
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-cdn"
  }
}
