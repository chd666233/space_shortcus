const vscode = require('vscode');
const FileTreeDataProvider = require('./fileTreeDataProvider.js');

function activate(context) {
  // 创建自定义树视图
  const treeView = vscode.window.createTreeView('fileShortcutTree', {
    treeDataProvider: new FileTreeDataProvider(),
    showCollapseAll: true
  });
  context.subscriptions.push(treeView);

  // 注册装饰器 <button class="citation-flag" data-index="5">
  const shortcutDecoration = vscode.window.createTextEditorDecorationType({
    after: {
      contentText: ' AA', // 添加空格分隔
      margin: '0 10px 0 0',
      backgroundColor: '#ff0',
      color: '#000',
      // borderRadius: '3px',
      fontWeight: 'bold'
    }
  });
  context.subscriptions.push(shortcutDecoration);

  // 监听文件打开事件 <button class="citation-flag" data-index="2">
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      updateDecorations(editor, shortcutDecoration);
    }
  }, null, context.subscriptions);

  // 初始加载
  if (vscode.window.activeTextEditor) {
    updateDecorations(vscode.window.activeTextEditor, shortcutDecoration);
  }
}

function deactivate() { }

module.exports = { activate, deactivate };

/**
 * 更新装饰器 <button class="citation-flag" data-index="5">
 * @param {vscode.TextEditor} editor 
 * @param {vscode.TextEditorDecorationType} decorationType 
 */
function updateDecorations(editor, decorationType) {
  // 获取文件名
  const fileName = editor.document.fileName;
  
  // 创建装饰器范围（文件开头）
  const decoration = {
    range: new vscode.Range(0, 0, 0, 0),
    hoverMessage: `Shortcut: AA`
  };

  // 应用装饰器
  editor.setDecorations(decorationType, [decoration]);
}