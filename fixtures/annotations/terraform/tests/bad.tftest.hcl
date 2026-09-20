run "bad" {
  command = plan
  assert {
    condition     = var.name == "x"
  }
}
