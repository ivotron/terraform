FROM hashicorp/terraform:0.12.3 AS terraform

FROM node:alpine

LABEL "com.github.actions.name"="terraform-validate"
LABEL "com.github.actions.description"="Validate Terraform configuration files"
LABEL "com.github.actions.icon"="terminal"
LABEL "com.github.actions.color"="blue"

COPY --from=terraform /bin/terraform /bin/terraform

COPY package*.json ./

RUN npm ci

COPY index*.js .

ENTRYPOINT ["node", "/index.js"]
