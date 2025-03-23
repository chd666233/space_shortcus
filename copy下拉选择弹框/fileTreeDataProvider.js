const vscode = require('vscode');
const path = require('path');

class FileTreeDataProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.filesObj = []
    this.files = [];
    this.shortcuts = new Map();
  }

  async refresh() {
    await this.loadFiles();
    this._onDidChangeTreeData.fire();
  }

  async loadFiles() {
    if (!vscode.workspace.workspaceFolders) return [];
    const files = await vscode.workspace.findFiles('**/*');
    this.files = files.map((uri, index) => {
      const shortcut = this.generateShortcut(index);
      const basepath = path.basename(uri.fsPath);
      // console.log("1:", uri.fsPath);
      // console.log("2:", uri.path);
      this.shortcuts.set(shortcut, uri.fsPath)
      this.filesObj.push({shortcut, name: basepath})
      return {
        uri,
        name: basepath,
        shortcut: shortcut
      }
    });
    // this._onDidChangeTreeData.fire(); // 手动触发更新
  }
  // 在getFiles方法中添加异常捕获
  async getFiles() {
    try {
      const files = await vscode.workspace.findFiles('**/*');
      return files.map((uri, index) => ({
        uri,
        name: path.basename(uri.fsPath)
      }));
    } catch (error) {
      vscode.window.showErrorMessage('Failed to load files');
      return [];
    }
  }
  generateShortcut(index) {
    return String.fromCharCode(65 + Math.floor(index / 26)) +
      String.fromCharCode(65 + index % 26); // AA, AB, AC...
  }

  // 在fileTreeDataProvider.js的getTreeItem中
  getTreeItem(node) {
    console.log('Rendering node:', node); // 添加调试日志
    return {
      label: `${node.name} [${node.shortcut}]`,
      // collapsibleState: vscode.TreeItemCollapsibleState.Expanded, // 默认展开 <button class="citation-flag" data-index="7">
      iconPath: vscode.ThemeIcon.File,
      command: {
        command: 'file.openWithShortcut',
        arguments: [node.uri],
        title: "Open File"
      },
      contextValue: 'fileNode'
    };
  }

  // getChildren() {
  //   return this.files;
  // }
  async getChildren() {
    const files = await vscode.workspace.findFiles('**/*');
    return files.map((uri, index) => ({
      uri,
      name: path.basename(uri.fsPath),
      shortcut: this.generateShortcut(index)
    }));
  }

}

module.exports = FileTreeDataProvider;