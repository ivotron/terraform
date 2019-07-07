# GitHub Action for Terraform

This Action wraps the [Terraform CLI](https://www.terraform.io/docs/commands/index.html) to enable common Terraform commands.

## Usage

Usage information for individual commands can be found in their respective directories.

* [`fmt`](/fmt)
* [`validate`](/validate)

Example workflow:

```hcl
workflow "Terraform" {
  on = "push"
  resolves = ["terraform-apply"]
}

action "terraform-fmt" {
  uses = "innovationnorway/terraform-action@master"
  args = ["fmt", "-check", "-recursive"]
}

action "terraform-init" {
  uses = "innovationnorway/terraform-action@master"
  needs = "terraform-fmt"
  args = ["init", "-input=false", "-no-color"]
  secrets = ["TFE_TOKEN"]
}

action "terraform-validate" {
  uses = "innovationnorway/terraform-action@master"
  needs = "terraform-init"
  args = ["validate", "-no-color"]
}

action "terraform-plan" {
  uses = "innovationnorway/terraform-action@master"
  needs = ["terraform-validate"]
  args = ["plan", "-input=false", "-no-color"]
  secrets = ["TFE_TOKEN"]
  env = {
    TF_IN_AUTOMATION = "true"
  }
}

action "filter-master-branch" {
  needs = ["terraform-plan"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "terraform-apply" {
  uses = "innovationnorway/terraform-action@master"
  needs = ["filter-master-branch"]
  args = ["apply", "-auto-approve", "-input=false", "-no-color"]
  secrets = ["TFE_TOKEN"]
  env = {
    TF_IN_AUTOMATION = "true"
  }
}
```

### Environment variables

* `TF_WORKSPACE` - (Optional) Set existing Terraform workspace name.
* `TFE_TOKEN` - (Optional) A Terraform Enterprise [user API token](https://www.terraform.io/docs/enterprise/users-teams-organizations/users.html#api-tokens).

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
