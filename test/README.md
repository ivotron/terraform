# Terraform Test

This Action runs `terraform init`, `terraform validate`, `terraform apply`, and then `terraform destroy`.

## Usage

```hcl
workflow "Terraform test" {
  on = "pull_request"
  resolves = ["terraform-test"]
}

action "terraform-test" {
  uses = "innovationnorway/github-action-terraform/test@v0.12.0-beta2"
  env = {
    TF_WORKING_DIR = "test"
  }
}
```

### Environment variables

* `TF_WORKING_DIR` - (Optional) Set working directory.

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
