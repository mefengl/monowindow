const vscode = require('vscode')

function activate(context) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE)

  statusBarItem.text = `$(terminal-tmux)`
  statusBarItem.tooltip = 'Merge All Window Tabs'
  statusBarItem.command = 'monowindow.mergeAllWindowTabs'

  statusBarItem.show()

  const disposable = vscode.commands.registerCommand('monowindow.mergeAllWindowTabs', () => {
    vscode.commands.executeCommand('workbench.action.mergeAllWindowTabs')
  })

  context.subscriptions.push(statusBarItem)
  context.subscriptions.push(disposable)
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
}
