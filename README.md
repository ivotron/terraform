# GitHub Action for Terraform

This Action wraps the [Terraform CLI](https://www.terraform.io/docs/commands/index.html) to enable common Terraform commands.

## Usage

Example workflow that will validate Terraform configuration on every `push` to the repo:

```hcl
workflow "Terraform" {
  on = "push"
  resolves = ["terraform-validate"]
}

action "terraform-fmt" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  args = ["fmt", "-check", "-list", "-no-color"]
}

action "terraform-init" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = "terraform-fmt"
  args = ["init", "-backend=false", "-input=false", "-no-color"]
}

action "terraform-validate" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = "terraform-init"
  args = ["validate", "-check-variables=false", "-no-color"]
}
```

Example workflow that will apply Terraform configuration on every `push`:

```hcl
workflow "Terraform" {
  on = "push"
  resolves = ["terraform-apply"]
}

action "terraform-fmt" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  args = ["fmt", "-check", "-no-color"]
}

action "terraform-init" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = "terraform-fmt"
  args = ["init", "-input=false", "-no-color"]
}

action "terraform-validate" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = "terraform-init"
  args = ["validate", "-no-color"]
}

action "terraform-plan" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = ["terraform-validate"]
  args = ["plan", "-input=false", "-no-color", "-out=tfplan"]
  secrets = ["VAULT_TOKEN"]
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
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = ["filter-master-branch"]
  args = ["apply", "-auto-approve", "-input=false", "-no-color", "tfplan"]
  secrets = ["VAULT_TOKEN"]
  env = {
    TF_IN_AUTOMATION = "true"
  }
}
```

Another example that uses workspaces:

```hcl
workflow "Terraform" {
  on = "push"
  resolves = ["terraform-apply-stage", "terraform-apply-prod"]
}

action "terraform-fmt" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  args = ["fmt", "-check", "-no-color"]
}

action "terraform-init" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = "terraform-fmt"
  args = ["init", "-input=false", "-no-color"]
}

action "terraform-validate" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = "terraform-init"
  args = ["validate", "-no-color"]
}

action "terraform-plan-stage" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = ["terraform-validate"]
  args = ["plan", "-input=false", "-no-color", "-out=tfplan"]
  secrets = ["VAULT_TOKEN"]
  env = {
    TF_IN_AUTOMATION = "true"
    TF_WORKSPACE = "stage"
  }
}

action "terraform-apply-stage" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = ["terraform-plan-stage"]
  args = ["apply", "-auto-approve", "-input=false", "-no-color", "tfplan"]
  secrets = ["VAULT_TOKEN"]
  env = {
    TF_IN_AUTOMATION = "true"
    TF_WORKSPACE = "stage"
  }
}

action "filter-master-branch" {
  needs = ["terraform-apply-stage"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "terraform-plan-prod" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = ["filter-master-branch"]
  args = ["plan", "-input=false", "-no-color", "-out=tfplan"]
  secrets = ["VAULT_TOKEN"]
  env = {
    TF_IN_AUTOMATION = "true"
    TF_WORKSPACE = "prod"
  }
}

action "terraform-apply-prod" {
  uses = "innovationnorway/github-action-terraform@v0.11.12-beta1"
  needs = ["terraform-plan-prod"]
  args = ["apply", "-auto-approve", "-input=false", "-no-color", "tfplan"]
  secrets = ["VAULT_TOKEN"]
  env = {
    TF_IN_AUTOMATION = "true"
    TF_WORKSPACE = "prod"
  }
}
```

### Environment variables

* `TF_WORKSPACE` - (Optional) Set existing Terraform workspace name.

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
