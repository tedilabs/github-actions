# Demo fixture. `var.nope` is never declared, so the plan fails and produces an error diagnostic
# with a file and a line, which the action turns into an annotation.

resource "terraform_data" "broken" {
  input = var.nope
}
