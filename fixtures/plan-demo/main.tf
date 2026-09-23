# Demo fixture. The committed `terraform.tfstate` stands in for a previous apply, and `managed.txt`
# is deliberately absent so the refresh reports it as changed outside of Terraform.

terraform {
  required_providers {
    local = { source = "hashicorp/local", version = "~> 2.5" }
  }
}

variable "size" {
  type    = string
  default = "large" # was "small" in the state, so `change_me` updates and `replace_me` is replaced
}

resource "local_file" "managed" {
  filename = "${path.module}/managed.txt"
  content  = "original"
}

resource "terraform_data" "change_me" {
  input = var.size
}

resource "terraform_data" "replace_me" {
  input            = "x"
  triggers_replace = [var.size]
}

# `terraform_data.gone` is in the state but not here, so it is destroyed.

output "current" {
  value = terraform_data.change_me.output
}

check "demonstrates_a_warning" {
  assert {
    condition     = var.size == "never-matches"
    error_message = "This check fails on purpose so the plan carries a warning."
  }
}
