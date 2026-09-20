source "null" "example" {
  communicator = "none"
  nope         = 1
}

build {
  sources = ["source.null.example"]
}
