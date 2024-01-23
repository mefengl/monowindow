const vscode = require('vscode')

let autoMonowindowInterval = null
let mergeStatusItem
let autoMonowindowStatusItem

function updateStatusItem() {
  if (autoMonowindowInterval) {
    autoMonowindowStatusItem.text = `$(check) $(terminal-tmux)`
    autoMonowindowStatusItem.tooltip = 'Auto MonoWindow is ON. Click to turn off'
  }
  else {
    autoMonowindowStatusItem.text = `$(x) $(terminal-tmux)`
    autoMonowindowStatusItem.tooltip = 'Auto MonoWindow is OFF. Click to turn on'
  }
}

function showOrHideStatusItems() {
  if (vscode.workspace.getConfiguration().get('monowindow.showMergeButton'))
    mergeStatusItem.show()
  else
    mergeStatusItem.hide()

  if (vscode.workspace.getConfiguration().get('monowindow.showToggleAutoButton'))
    autoMonowindowStatusItem.show()
  else
    autoMonowindowStatusItem.hide()
}

function activate(context) {
  mergeStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE)
  mergeStatusItem.text = `$(terminal-tmux)`
  mergeStatusItem.tooltip = 'Merge All Window Tabs'
  mergeStatusItem.command = 'monowindow.mergeAllWindowTabs'

  autoMonowindowStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE)
  autoMonowindowStatusItem.command = 'monowindow.toggleAutoMonowindow'
  updateStatusItem()

  showOrHideStatusItems()

  vscode.workspace.onDidChangeConfiguration(() => {
    showOrHideStatusItems()
  })

  const disposableMerge = vscode.commands.registerCommand('monowindow.mergeAllWindowTabs', () => {
    vscode.commands.executeCommand('workbench.action.mergeAllWindowTabs')
  })

  const disposableToggle = vscode.commands.registerCommand('monowindow.toggleAutoMonowindow', () => {
    if (autoMonowindowInterval) {
      clearInterval(autoMonowindowInterval)
      autoMonowindowInterval = null
    }
    else {
      autoMonowindowInterval = setInterval(() => {
        vscode.commands.executeCommand('workbench.action.mergeAllWindowTabs')
      }, 1000)
    }
    updateStatusItem()
  })

  context.subscriptions.push(mergeStatusItem, disposableMerge, disposableToggle, autoMonowindowStatusItem)
}

function deactivate() {
  if (autoMonowindowInterval)
    clearInterval(autoMonowindowInterval)
}

module.exports = {
  activate,
  deactivate,
}
