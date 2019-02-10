FROM alpine:latest

LABEL version="1.0.0"
LABEL repository="http://github.com/innovationnorway/github-action-terraform"
LABEL homepage="http://github.com/innovationnorway/github-action-terraform"
LABEL maintainer="Innovation Norway Support <support+github@innovationnorway.com>"

LABEL "com.github.actions.name"="GitHub Action for Terraform"
LABEL "com.github.actions.description"="Wraps the Terraform CLI to enable common Terraform commands."
LABEL "com.github.actions.icon"="box"
LABEL "com.github.actions.color"="purple"

COPY LICENSE README.md THIRD_PARTY_NOTICE.md /

ENV TERRAFORM_VERSION=0.11.12-beta1
ENV TERRAFORM_SHA256SUM=5a8c4f734ae58a3b2583d9b93c619fe7ab0e7b76c5a7d51ecc956166fb279258

RUN apk add --update git curl openssh && \
    curl https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip > terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    echo "${TERRAFORM_SHA256SUM}  terraform_${TERRAFORM_VERSION}_linux_amd64.zip" > terraform_${TERRAFORM_VERSION}_SHA256SUMS && \
    sha256sum -cs terraform_${TERRAFORM_VERSION}_SHA256SUMS && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /usr/local/bin && \
    rm -f terraform_${TERRAFORM_VERSION}_linux_amd64.zip

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
