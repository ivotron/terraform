const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
  await tools.runInWorkspace('terraform', ['init', '-backend=false'])
  const { stdout } = await tools.runInWorkspace('terraform', ['validate', '-json'], { reject: false })
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

  await tools.github.checks.create({
    ...tools.context.repo,
    name: `actions/terraform-validate`,
    head_sha: tools.context.sha,
    status: 'completed',
    conclusion: result.valid ? 'success' : 'failure',
    completed_at: new Date(),
    output: {
      title: result.valid ? 'No errors' : `${result.error_count} error(s), ${result.warning_count} warning(s)`,
      summary: `terraform validate ${result.valid ? 'succeeded' : 'failed'} with ${result.error_count} error(s) and ${result.warning_count} warning(s).`,
      annotations: annotations
    }
  })

  if (result.valid) {
    tools.exit.success()
  } else {
    tools.exit.failure()
  }
},
  {
    event: ['pull_request.opened', 'pull_request.rerequested', 'pull_request.synchronize'],
    secrets: ['GITHUB_TOKEN']
  })
