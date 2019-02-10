FROM hashicorp/terraform:0.11.11

LABEL version="1.0.0"
LABEL repository="http://github.com/innovationnorway/actions/terraform"
LABEL homepage="http://github.com/innovationnorway/actions/terraform"
LABEL maintainer="Innovation Norway Support <support+github@innovationnorway.com>"

LABEL "com.github.actions.name"="GitHub Action for Terraform"
LABEL "com.github.actions.description"="Wraps the Terraform CLI to enable common Terraform commands."
LABEL "com.github.actions.icon"="box"
LABEL "com.github.actions.color"="purple"

COPY LICENSE README.md THIRD_PARTY_NOTICE.md /

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]