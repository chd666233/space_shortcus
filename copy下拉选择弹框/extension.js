const vscode = require('vscode');
const FileTreeDataProvider = require('./fileTreeDataProvider.js');
let dialogPanel;
// 弹窗实现方案 - extension.ts

let modalPanel;
const fileTreeProvider = new FileTreeDataProvider();

async function activate(context) {
  // // 注册模态弹窗命令
  // const showCommand = vscode.commands.registerCommand('extension.showShortcutModal', async () => {
  //   // 创建模态弹窗
  //   modalPanel = vscode.window.createWebviewPanel(
  //     'shortcutModal',
  //     'File Shortcuts',
  //     vscode.ViewColumn.Active, // 在当前窗口显示
  //     {
  //       enableScripts: true,
  //       retainContextWhenHidden: true,
  //       // 启用遮罩层实现模态效果
  //       enableCommandUris: true
  //     }
  //   );

  //   // 设置模态特性
  //   modalPanel.onDidChangeViewState(e => {
  //     if (!e.webviewPanel.visible) {
  //       modalPanel.dispose(); // 关闭时销毁
  //     }
  //   });

  //   // 设置弹窗内容
  //   modalPanel.webview.html = getWebviewContent();

  //   // 准备文件数据
  //   const files = await fileTreeProvider.getFiles();
  //   const shortcuts = files.map((file, index) => ({
  //     name: file.name,
  //     shortcut: generateShortcut(index),
  //     uri: file.uri.toString()
  //   }));

  //   // 发送数据到Webview
  //   modalPanel.webview.postMessage({
  //     type: 'init',
  //     data: shortcuts
  //   });

  //   // 处理快捷键选择
  //   modalPanel.webview.onDidReceiveMessage(async (message) => {
  //     if (message.command === 'select') {
  //       const uri = vscode.Uri.parse(message.uri);
  //       await vscode.commands.executeCommand('vscode.open', uri);
  //       modalPanel.dispose(); // 选择后关闭弹窗
  //     }
  //   });
  // });

  // context.subscriptions.push(showCommand);
  // 显示文件列表弹窗
  await fileTreeProvider.loadFiles();
  vscode.window.showQuickPick(
    fileTreeProvider.filesObj.map(f => `${f.shortcut}: ${f.name}`),
    { placeHolder: '选择文件' }
  ).then(selection => {
    console.log(selection);
    if (selection) {
      const uri = fileTreeProvider.filesObj.find(f =>
        selection.startsWith(f.shortcut)
      )?.uri;
      uri && vscode.commands.executeCommand('vscode.open', uri);
    }
  });
}

function generateShortcut(index) {
  const base = 'A'.charCodeAt(0);
  return String.fromCharCode(
    base + Math.floor(index / 26),
    base + (index % 26)
  );
}

function getWebviewContent() {
  return `
    <style>
      body {
        padding: 20px;
        font-family: Arial;
        max-width: 400px;
        background: #2d2d2d;
        color: white;
      }
      .modal-header {
        font-size: 1.2em;
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 1px solid #444;
      }
      .file-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .file-item:hover {
        background: #3a3a3a;
      }
      .shortcut {
        color: #ffcc00;
        font-weight: bold;
        margin-left: 10px;
      }
      .modal-footer {
        margin-top: 20px;
        text-align: right;
      }
      button {
        background: #007acc;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }
    </style>
    <div class="modal-header">文件快捷键列表</div>
    <div id="file-list"></div>
    <div class="modal-footer">
      <button onclick="vscode.postMessage({command: 'close'})">关闭</button>
    </div>
    <script>
      window.addEventListener('message', (event) => {
        if (event.data.type === 'init') {
          const container = document.getElementById('file-list');
          event.data.data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerHTML = \`
              <span>\${item.name}</span>
              <span class="shortcut">\${item.shortcut}</span>
            \`;
            div.onclick = () => {
              vscode.postMessage({
                command: 'select',
                uri: item.uri
              });
            };
            container.appendChild(div);
          });
        }
      });
    </script>
  `;
}

function deactivate() { }

module.exports = { activate, deactivate };