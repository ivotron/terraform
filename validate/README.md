# Terraform Validate

This Action runs `terraform validate` on pull requests.

## Usage

```hcl
workflow "Terraform" {
  on = "pull_request"
  resolves = ["terraform-validate"]
}

action "terraform-validate" {
  uses = "innovationnorway/terraform-action/validate@master"
  secrets = ["GITHUB_TOKEN"]
}
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
