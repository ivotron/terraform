# Terraform Validate

This Action runs `terraform validate` on pull requests.

## Usage

```hcl
workflow "Terraform" {
  on = "pull_request"
  resolves = ["terraform-validate"]
}

action "terraform-validate" {
  uses = "innovationnorway/github-action-terraform/validate@master"
  secrets = ["GITHUB_TOKEN"]
}
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
