const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
  await tools.runInWorkspace('git', ['config', '--global', 'user.email', 'actions@github.com'])
  await tools.runInWorkspace('git', ['config', '--global', 'user.name', 'GitHub Actions'])

  const { code, stderr } = await tools.runInWorkspace('terraform', ['fmt', '-check', '-recursive'], { reject: false })

  switch (code) {
    case 0:
      tools.exit.success()
    case 2:
      tools.exit.failure(stderr)
    case 3:
      await tools.runInWorkspace('terraform', ['fmt', '-write', '-recursive'])
      await tools.runInWorkspace('git', ['add', '*.tf'])
      await tools.runInWorkspace('git', ['commit', '-m', 'terraform fmt'])
      await tools.runInWorkspace('git', ['push', '-u', 'origin', tools.context.payload.pull_request.head.ref])
  }
},
  {
    event: ['pull_request.opened', 'pull_request.rerequested', 'pull_request.synchronize']
  })
