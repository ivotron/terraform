const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
  try {
    await tools.runInWorkspace(
      'terraform',
      ['init', '-backend=false', '-no-color']
    )
  } catch (err) {
    await tools.github.checks.create({
      ...tools.context.repo,
      name: `actions/terraform-validate`,
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

  const { stdout } = await tools.runInWorkspace(
    'terraform',
    ['validate', '-json'],
    { reject: false }
  )
  const result = JSON.parse(stdout)

  const annotations = (
    result.diagnostics.map(diagnostic => {
      let annotations = {
        path: diagnostic.range.filename,
        start_line: diagnostic.range.start.line,
        end_line: diagnostic.range.end.line,
        annotation_level: diagnostic.severity === "error" ? "failure" : diagnostic.severity,
        message: `${diagnostic.detail}`,
        title: diagnostic.summary
      }

      if (diagnostic.range.start.line === diagnostic.range.end.line) {
        annotations['start_column'] = diagnostic.range.start.column
        annotations['end_column'] = diagnostic.range.end.column
      }

      return annotations
    })
  )

  if (result.valid) {
    await tools.github.checks.create({
      ...tools.context.repo,
      name: `actions/terraform-validate`,
      head_sha: tools.context.sha,
      status: 'completed',
      conclusion: 'success',
      completed_at: new Date(),
      output: {
        title: 'Success!',
        summary: 'The configuration is valid.'
      }
    })
    tools.exit.success()
  } else {
    await tools.github.checks.create({
      ...tools.context.repo,
      name: `actions/terraform-validate`,
      head_sha: tools.context.sha,
      status: 'completed',
      conclusion: 'failure',
      completed_at: new Date(),
      output: {
        title: `${result.error_count} errors, ${result.warning_count} warnings`,
        summary: 'The configuration is not valid.',
        annotations: annotations
      }
    })
    tools.exit.failure()
  }
},
  {
    event: ['pull_request.opened', 'pull_request.rerequested', 'pull_request.synchronize'],
    secrets: ['GITHUB_TOKEN']
  })
