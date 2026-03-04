# ── Remote State Backend ──
# Uncomment after your first `terraform apply` and run `terraform init -migrate-state`
#
# terraform {
#   backend "s3" {
#     bucket         = "tech-portal-terraform-state"
#     key            = "tech-portal/terraform.tfstate"
#     region         = "eu-west-3"
#     dynamodb_table = "terraform-locks"
#     encrypt        = true
#   }
# }
