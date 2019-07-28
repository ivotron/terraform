# Terraform Test

This Action runs `terraform init`, `terraform apply` and `terraform destroy` on `pull_request`.

## Usage

```hcl
workflow "Terraform" {
  on = "pull_request"
  resolves = ["terraform-test"]
}

action "terraform-test" {
  uses = "innovationnorway/terraform-action/test@master"
  args = ["--dir", "./test"]
  secrets = ["GITHUB_TOKEN"]
}
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
