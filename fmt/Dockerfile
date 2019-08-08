FROM hashicorp/terraform:0.12.6 AS terraform

FROM node:alpine

LABEL "com.github.actions.name"="terraform-fmt"
LABEL "com.github.actions.description"="Rewrites Terraform config files to canonical format."
LABEL "com.github.actions.icon"="terminal"
LABEL "com.github.actions.color"="blue"

COPY --from=terraform /bin/terraform /bin/terraform

COPY package*.json ./

RUN apk --no-cache add curl git && npm ci

COPY index*.js .

ENTRYPOINT ["node", "/index.js"]
