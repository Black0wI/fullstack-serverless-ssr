# ── Project Settings ──

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "tech-portal"
}

variable "environment" {
  description = "Deployment environment (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region for S3 bucket and other regional resources"
  type        = string
  default     = "eu-west-3"
}

# ── Domain & SSL ──

variable "domain_name" {
  description = "Custom domain name for CloudFront (leave empty for CloudFront default domain)"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for custom domain (must be in us-east-1)"
  type        = string
  default     = ""
}

# ── CloudFront ──

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.cloudfront_price_class)
    error_message = "Must be PriceClass_100, PriceClass_200, or PriceClass_All."
  }
}

# ── Tags ──

variable "tags" {
  description = "Default tags applied to all resources"
  type        = map(string)
  default = {
    Project   = "tech-portal"
    ManagedBy = "terraform"
  }
}
