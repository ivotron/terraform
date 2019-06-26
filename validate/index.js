const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
  await tools.runInWorkspace('terraform', ['init', '-backend=false'], { reject: false })

  const result = await tools.runInWorkspace('terraform', ['validate', '-json'], { reject: false })
  const json = JSON.parse(result.stdout)

  const annotations = (
    json.diagnostics.map(diagnostic => {
      if (diagnostic.range.filename) {
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
      }
    })
  )

  await tools.github.checks.create({
    ...tools.context.repo,
    name: `actions/terraform-validate`,
    head_sha: tools.context.sha,
    status: 'completed',
    conclusion: json.valid ? 'success' : 'failure',
    completed_at: new Date(),
    output: {
      title: 'terraform validate',
      summary: json.valid ? 'No errors :tada:' : `${json.error_count} error(s) and ${json.warning_count} warning(s).`,
      annotations: annotations
    }
  })

  if (json.valid) {
    tools.exit.success()
  } else {
    tools.exit.failure()
  }
},
  {
    event: ['pull_request.opened', 'pull_request.synchronize'],
    secrets: ['GITHUB_TOKEN']
  })
