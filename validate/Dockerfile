FROM hashicorp/terraform:0.12.6 AS terraform

FROM node:alpine

LABEL "com.github.actions.name"="terraform-validate"
LABEL "com.github.actions.description"="Validate Terraform files."
LABEL "com.github.actions.icon"="terminal"
LABEL "com.github.actions.color"="blue"

COPY --from=terraform /bin/terraform /bin/terraform

COPY package*.json ./

RUN apk --no-cache add curl && npm ci

COPY index*.js .

ENTRYPOINT ["node", "/index.js"]
