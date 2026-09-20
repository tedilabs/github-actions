variable "name" {
  type = string
}

locals {
  unused = "never read"
}

output "greeting" {
  value = var.nope
}
