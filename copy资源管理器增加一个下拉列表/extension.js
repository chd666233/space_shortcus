const vscode = require('vscode');
const FileTreeDataProvider = require('./fileTreeDataProvider.js')
const fileTreeProvider = new FileTreeDataProvider();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "cshiftfgo" is now active!');

  let keyListener;
  let inputBuffer = [];
  const onkeyPress = (key) => {
    console.log('Key pressed:', key, 'Buffer:', inputBuffer.join(''));
    if (!key) return;
    inputBuffer.push(key);
    const matchPath = fileTreeProvider.shortcuts.get(inputBuffer.join(''))
    if (matchPath) {
      vscode.commands.executeCommand('vscode.open', vscode.Uri.file(matchPath));

      inputBuffer = [];
      keyListener.dispose();
      keyListener = undefined;
      fileTreeProvider.shortcuts.clear();
      vscode.commands.executeCommand('setContext', 'cshiftfgo.shortcutsActive', false);
    }
  }

  // 添加显式刷新调用
  // fileTreeProvider.refresh()
  // 创建Treeview
  const treeView = vscode.window.createTreeView('fileShortcutsView', {
    treeDataProvider: fileTreeProvider,
    showCollapseAll: true
  });
  // 自动展开逻辑
  // treeView.onDidChangeVisibility(async e => {
  //   if (e.visible) {
  //     // await fileTreeProvider.refresh(); // 确保数据加载完成
  //     // expandAllNodes(treeView);
  //   }
  // });
// 注册文件打开命令 点击文件名打开文件
context.subscriptions.push(
  vscode.commands.registerCommand('fileShortcuts.openFile', (uri) => {
    vscode.commands.executeCommand('vscode.open', uri);
  })
);
// 刷新Treeview  通过Ctrl+Shift+P 输入命令名称（如 "File Shortcuts: Refresh"）
//通过代码触发：vscode.commands.executeCommand('fileShortcuts.refresh');
// context.subscriptions.push(
//   vscode.commands.registerCommand('fileShortcuts.refresh', () =>
//     fileTreeProvider.refresh()
//   )
// );

const show = vscode.commands.registerCommand('extension.showShortcutOverlay', async function () {
  vscode.window.showInformationMessage('Hello World from CShiftFGo!');
  fileTreeProvider.refresh()

  vscode.commands.executeCommand('setContext', 'cshiftfgo.shortcutsActive', true);
  keyListener = vscode.commands.registerCommand('file-shortcuts.onKeyPress', onkeyPress);
  context.subscriptions.push(keyListener)
});
context.subscriptions.push(show);
  
}

// This method is called when your extension is deactivated
function deactivate() {

}

module.exports = {
  activate,
  deactivate
}



async function expandAllNodes(treeView) {
  const nodes = await fileTreeProvider.getChildren();
  for (const node of nodes) {
    await treeView.reveal(node, { expand: true }); // 展开节点 <button class="citation-flag" data-index="7">
  }
}