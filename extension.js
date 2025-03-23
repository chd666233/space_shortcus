const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const FileTreeDataProvider = require('./fileTreeDataProvider.js')
const fileTreeProvider = new FileTreeDataProvider();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let keyListener;
  let inputBuffer = [];
  let panel;
  let activityBar;
  const onKeyPress = async (key) => {
    // console.log('inputBuffer: ', key);
    if (!key) return;
    inputBuffer.push(key);
    let str = inputBuffer.join('');
    const matchPath = fileTreeProvider.souPathOComMap.get(str)
    const match1 = fileTreeProvider.activityBarMap.get(str);
    const match2 = fileTreeProvider.searchBarMap.get(str);
    const match3 = fileTreeProvider.debugBarMap.get(str);
    const match4 = fileTreeProvider.scmBarMap.get(str);


    if (!(matchPath || match1 || match2 || match3 || match4)) {
      return;
    }

    const comms = matchPath ? ['vscode.open'] : (match1 || match2 || match3 || match4).path;
    const cb = matchPath ? vscode.Uri.file(matchPath.path) : undefined;
    const exe = vscode.commands.executeCommand;

    let nextKeyPressPromise;
    try {
      for (const [index, comm] of comms.entries()) {
        // console.log(index, comm, comms, ...comms);
        // if (index === comms.length - 1) {
        //   nextKeyPressPromise = cb ? exe(comm, cb) : exe(comm);
        // } else {
        //   await exe(comm);
        // }

        // if(!nextKeyPressPromise) {
        //   nextKeyPressPromise = cb ? exe(comm, cb) : exe(comm);
        // } else {
        //   nextKeyPressPromise.then(()=>{
        //     ❌nextKeyPressPromise = cb ? exe(comm, cb) : exe(comm);
        //   })
        // if (!nextKeyPressPromise) {
        //   nextKeyPressPromise = cb && index === comms.length - 1 ? exe(comm, cb) : exe(comm);
        // } else {
        //   nextKeyPressPromise = nextKeyPressPromise.then(() => {
        //     return cb && index === comms.length - 1 ? exe(comm, cb) : exe(comm);
        //   }, (err) => {
        //     const errorMessage = `操作失败1：${err.message || '未知错误'}\n${err.stack || ''}`;
        //     // str==='AM'&&vscode.version>='1.64.0'? errorMessage:'需升级到VS Code 1.64+'; 
        //     vscode.window.showErrorMessage(errorMessage, { modal: false });
        //   })
        // }
        // } 
        const hasCb = cb && index === comms.length - 1;
        nextKeyPressPromise = await (hasCb ? exe(comm, cb) : exe(comm));
      }
    } catch (err) {
      const errorMessage = `操作失败：${err.message || '未知错误'}\n${err.stack || ''}`;
      // str==='AM'&&vscode.version>='1.64.0'? errorMessage:'需升级到VS Code 1.64+'; 
      vscode.window.showErrorMessage(errorMessage, { modal: false });
    } finally {
      closeCshiftgo();
    }
  }
  function closeCshiftgo() {
    resetKeyPress();
    htmlPanelClose();
  }

  function resetKeyPress() {
    // if (!keyListener) return;
    // keyListener.dispose();
    // keyListener = undefined;
    inputBuffer = [];
    // 键盘快捷键是否继续活动
    vscode.commands.executeCommand('setContext', 'cshiftfgo.shortcutsActive', false);
    vscode.commands.executeCommand('setContext', 'cshiftfgo.activeBar_' + activityBar, false);
  }
  function bindKeyPress() {
    resetKeyPress();//绑定前重置
    // keyListener = vscode.commands.registerCommand('cshiftfgo.onKeyPress', onKeyPress)
    // context.subscriptions.push(keyListener);
    vscode.commands.executeCommand('setContext', 'cshiftfgo.shortcutsActive', true);
    vscode.commands.executeCommand('setContext', 'cshiftfgo.activeBar_' + activityBar, true);
  }
  function overlayPanelHtmlKeyPress(ab) {
    activityBar = ab;
    createOverlayPanel();
    bindKeyPress();
  }

  function show_x(activityBar, panel) {
    const fullComm = 'cshiftfgo.showShortcutOverlay_' + activityBar;
    const _register = vscode.commands.registerCommand(fullComm, panel);
    context.subscriptions.push(_register);
  }
  ['explorer', 'search', 'scm', 'debug'].forEach(item => show_x(item, () => overlayPanelHtmlKeyPress(item)));

  vscode.commands.registerCommand('cshiftfgo.closeCshiftgo', closeCshiftgo);

  async function htmlVal() {
    await fileTreeProvider.refresh([activityBar]);
    // console.log(fileTreeProvider.activityBarMap);
    // console.log(fileTreeProvider.souPathOComMap);
    // console.log(fileTreeProvider.searchBarMap);
    // console.log(fileTreeProvider.scmBarMap);
    // console.log(fileTreeProvider.debugBarMap);
    let data;
    const bs = fileTreeProvider.activityBarMap;
    if (activityBar === 'explorer') {
      data = fileTreeProvider.souPathOComMap;
      // data = [...bs, ...data].map(arr => arr[1]);
    } else if (activityBar === 'search') {
      // if(fileTreeProvider.searchBarMap.size===0){
      //   fileTreeProvider.getSearchSiderBar();
      // }
      data = fileTreeProvider.searchBarMap;
      //data = [...bs, ...data].map(arr => arr[1]);
    } else if (activityBar === 'scm') {
      data = fileTreeProvider.scmBarMap;
      //data = [...bs, ...data].map(arr => arr[1]);
    } else if (activityBar === 'debug') {
      data = fileTreeProvider.debugBarMap;
      //data = [...bs, ...data].map(arr => arr[1]);
    }
    const bs1 = [...bs].map(arr => arr[1]);
    data = [...data].map(arr => arr[1]);
    // console.log(Array.from(data, ([key, val])=> val));
    // console.log();
    panel.webview.postMessage({
      type: 'pathShortcut',
      pathShortcut: data,
      bs: bs1
    })
  }

  function clearHtmlVal() {
    fileTreeProvider.clear();
  }
  function createOverlayPanel() {
    // if (panel) {
    //   // 如果 Webview 已经存在，则让它显示，而不是创建新的
    //   panel.reveal(vscode.ViewColumn.One);
    //   return;
    // }
    htmlPanelClose();
    // vscode.commands.executeCommand('setContext', 'cshiftfgo.shortcutsActive', true);
    panel = vscode.window.createWebviewPanel(
      'cshiftfgo.overlay',
      '键盘导航',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'resources'))
        ]
      } // 允许执行脚本

    )
    // 显式切换焦点到 Webview
    setTimeout(() => panel.reveal(vscode.ViewColumn.One), 50)
    const imagePath = getBgImg(context);
    const imageUri = panel.webview.asWebviewUri(imagePath);


    panel.onDidChangeViewState(e => {
      if (!e.webviewPanel.visible) {
        panel.dispose(); //手动点击不会触发.失去焦点的时候触发。
      }
    });
    panel.webview.html = getWebviewContent().replace("{{imgUri}}",imageUri.toString());
    panel.webview.onDidReceiveMessage(message => {
      const type = message.type;
      const key = message.key;
      if (type === 'requestPathShortcut') {
        htmlVal();
      } else if (type === 'Backspace') {
        inputBuffer.splice(-1, 1);
      } else if (type === 'clearBuffer') {
        inputBuffer = [];
      } else if (type === 'key') {
        onKeyPress(key);
      }
    })
    panel.onDidDispose(() => { //只要关闭就触发，包括手动点击关闭，panel.dispose关闭
      if (!panel) return; //
      closeCshiftgo();//如果手动点击x关闭了overlay或者panel.dispose()关闭
    })
  }
  function htmlPanelClose() {
    if (!panel) return;

    panel.dispose();
    panel = undefined;
    clearHtmlVal();
  }


}

function deactivate() {

}
module.exports = {
  activate,
  deactivate
}

function getWebviewContent() {
  const htmlPath = path.join(__dirname, 'webview.html');
  return fs.readFileSync(htmlPath, 'utf-8');
}
function getBgImg(context) {

  // 替换图片路径为 Webview 可访问的 URI
  const imagePath = vscode.Uri.file(
    path.join(context.extensionPath, 'resources', 'images', 'background.jpg')
  );
  return imagePath;
  //  const imageUri = panel.webview.asWebviewUri(imagePath);

}