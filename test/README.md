# Terraform Test

This Action runs `terraform init`, `terraform apply` and `terraform destroy` on `pull_request`.

## Usage

```hcl
workflow "Terraform" {
  on = "pull_request"
  resolves = ["terraform-fmt"]
}

action "terraform-test" {
  uses = "innovationnorway/terraform-action/test@master"
  secrets = ["GITHUB_TOKEN"]
}
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
