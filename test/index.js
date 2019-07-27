const { Toolkit } = require('actions-toolkit')
const fs = require('fs')

Toolkit.run(async tools => {
  const token = process.env.TFE_TOKEN
  const dir = tools.arguments.dir || tools.arguments._[0] || '.'

  if (token) {
    fs.writeFileSync(`${process.env.HOME}/.terraformrc`,
      `credentials "app.terraform.io" {\n  token = "${token}"\n}`, err => {
        if (err) tools.exit.failure(err)
      })
  }

  try {
    await tools.runInWorkspace(
      'terraform',
      ['init', '-input=false', '-no-color', dir]
    )
  } catch (err) {
    await tools.github.checks.create({
      ...tools.context.repo,
      name: `actions/terraform-test`,
      head_sha: tools.context.sha,
      status: 'completed',
      conclusion: 'failure',
      completed_at: new Date(),
      output: {
        title: 'Error initializing Terraform configuration',
        summary: '`terraform init` failed.',
        text: `\`\`\`\n${err.stderr}\n\`\`\``
      }
    })
    tools.exit.failure(err)
  }

  try {
    await tools.runInWorkspace(
      'terraform',
      ['apply', '-auto-approve', '-input=false', '-no-color', dir]
    )
  } catch (err) {
    await tools.github.checks.create({
      ...tools.context.repo,
      name: `actions/terraform-test`,
      head_sha: tools.context.sha,
      status: 'completed',
      conclusion: 'failure',
      completed_at: new Date(),
      output: {
        title: 'Error applying Terraform configuration',
        summary: '`terraform apply` failed.',
        text: `\`\`\`\n${err.stderr}\n\`\`\``
      }
    })
    tools.log.fatal(err)
  } finally {
    try {
      await tools.runInWorkspace(
        'terraform',
        ['destroy', '-auto-approve', '-input=false', '-no-color', dir]
      )
    } catch (err) {
      tools.exit.failure(err)
    }
  }

  try {
    await tools.runInWorkspace(
      'terraform',
      ['destroy', '-auto-approve', '-input=false', '-no-color', dir]
    )
  } catch (err) {
    await tools.github.checks.create({
      ...tools.context.repo,
      name: `actions/terraform-test`,
      head_sha: tools.context.sha,
      status: 'completed',
      conclusion: 'failure',
      completed_at: new Date(),
      output: {
        title: 'Error destroying Terraform configuration',
        summary: '`terraform destroy` failed.',
        text: `\`\`\`\n${err.stderr}\n\`\`\``
      }
    })
    tools.exit.failure(err)
  }

  await tools.github.checks.create({
    ...tools.context.repo,
    name: `actions/terraform-test`,
    head_sha: tools.context.sha,
    status: 'completed',
    conclusion: 'success',
    completed_at: new Date(),
    output: {
      title: 'Hooray!',
      summary: 'No errors :tada:',
      text: `\`\`\`\n👍\n\`\`\``
    }
  })
  tools.exit.success()
},
  {
    event: ['pull_request.opened', 'pull_request.rerequested', 'pull_request.synchronize'],
    secrets: ['GITHUB_TOKEN']
  })
