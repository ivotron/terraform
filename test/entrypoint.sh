#!/bin/sh

set -e

cd "${TF_WORKING_DIR:-.}"

export TF_CLI_ARGS="-no-color"
export TF_IN_AUTOMATION=true
export TF_INPUT=false

terraform init -backend=false
terraform validate
terraform apply -auto-approve
terraform destroy -auto-approve
