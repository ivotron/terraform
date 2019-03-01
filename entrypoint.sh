#!/bin/sh

set -e

if [ ! -z $TFE_TOKEN ]; then
  cat << EOF > ~/.terraformrc
credentials "app.terraform.io" {
  token = "${TFE_TOKEN}"
}
EOF
fi

sh -c "terraform $*"
