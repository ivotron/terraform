# Terraform Format

This Action runs `terraform fmt` on pull requests.

## Usage

```hcl
workflow "Terraform" {
  on = "pull_request"
  resolves = ["terraform-fmt"]
}

action "terraform-fmt" {
  uses = "innovationnorway/terraform-action/fmt@master"
  secrets = ["GITHUB_TOKEN"]
}
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
