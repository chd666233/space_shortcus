const vscode = require("vscode");
const path = require("path");
const activityBar = [
  { name: "资源管理器", commands: ["workbench.view.explorer"] },
  { name: "搜索", commands: ["workbench.view.search"] },
  { name: "源代码管理", commands: ["workbench.view.scm"] },
  { name: "运行和调试", commands: ["workbench.view.debug"] },
  { name: "扩展", commands: ["workbench.view.extensions"] },
  { name: "问题", commands: ["workbench.actions.view.problems"] },
  { name: "输出", commands: ["workbench.action.output.toggleOutput"] },
  { name: "调试控制台", commands: ["workbench.debug.action.toggleRepl"] },
  { name: "终端", commands: ["workbench.action.terminal.toggleTerminal"] },
  { name: "端口", commands: ["remote.tunnel.forwardCommandPalette"] },
  { name: "用户设置(JSON)", commands: ["workbench.action.openSettingsJson"] },
  {
    name: "工作区(JSON)",
    commands: ["workbench.action.openWorkspaceSettingsFile"]
  },
  {
    name: "默认设置(JSON)",
    commands: ["workbench.action.openRawDefaultSettings"]
  },
  {
    name: "键盘快捷方式(JSON)",
    commands: ["workbench.action.openGlobalKeybindingsFile"]
  },
  {
    name: "默认键盘快捷键(JSON)",
    commands: ["workbench.action.openDefaultKeybindingsFile"]
  }
];
const searchSiderBar = [
  { name: "刷新", commands: ["search.action.refreshSearchResults"] },
  { name: "清除搜索结果", commands: ["search.action.clearSearchResults"] },
  { name: "打开新的搜索编辑器", commands: ["search.action.openNewEditor"] },
  { name: "以树形查看", commands: ["search.action.viewAsTree"] },
  { name: "以列表查看", commands: ["search.action.viewAsList"] },
  { name: "全部折叠", commands: ["search.action.collapseSearchResults"] },
  { name: "全部展开", commands: ["search.action.expandSearchResults"] },
  { name: "将焦点聚焦到搜索", commands: ["workbench.view.search.focus"] },
  { name: "将焦点聚焦到列表", commands: ["search.action.focusSearchList"] },
  { name: "在编辑器中查看搜索结果", commands: ["search.action.openInEditor"] },
  { name: "查找:区分大小写", commands: ["toggleSearchCaseSensitive"] },
  { name: "查找:切换搜索全字匹配", commands: ["toggleSearchWholeWord"] },
  { name: "查找:切换使用正则表达式", commands: ["toggleSearchRegex"] },
  { name: "替换:折叠替换", commands: ["workbench.action.findInFiles"] },
  { name: "替换:展开替换", commands: ["workbench.action.replaceInFiles"] },
  {
    name: "替换:保留大小写",
    commands: ["workbench.action.replaceInFiles", "toggleSearchPreserveCase"]
  },
  {
    name: "替换:全部替换",
    commands: ["workbench.action.replaceInFiles", "search.action.replaceAll"]
  },
  {
    name: "包含的文件、排除的文件",
    commands: [
      "workbench.view.search.focus",
      "workbench.action.search.toggleQueryDetails"
    ]
  },
  { name: "<strike>查找:仅在打开的编辑器中搜索</strike>", commands: [] }, //https://github.com/microsoft/vscode/issues/131437
  { name: '<strike>查找:使用"排除设置"与"忽略文件"</strike>', commands: [] } //
  //toggleSearchEditorWholeWord // 切换搜索全字匹配
  //toggleSearchEditorRegex 使用正则表达式

  // toggleSearchPreserveCase
  // togglePreserveCase
  // workbench.view.search.focus
  // @command:search.action.focusFilesToInclude +when:inSearchEditor
  // toggleSearchEditorCaseSensitive
  // @command:workbench.action.findInFiles //在文件中查找
  // @command:workbench.action.replaceInFiles //在文件中替换
  // search.action.focusFilesToInclude
];
const debugSiderBar = [
  { name: "运行和调试", commands: ["workbench.action.debug.run"] }, //✅运行和调试 根据launch.json或者select and start命令选中的调试器直接运行相当于F5
  {
    name: "创建 luanch.json文件",
    commands: ["workbench.action.debug.configure"]
  }, //✅
  {
    name: "JavaScript 调试终端",
    commands: ["extension.js-debug.createDebuggerTerminal"]
  }, 
  { name: "调试 URL", commands: ["extension.js-debug.debugLink"] }, //✅调试 URL
  { name: "开始调试(F5)", commands: ["workbench.action.debug.start"] },
  { name: "变量", commands: ["workbench.debug.action.focusVariablesView"] }, //变量
  { name: "监视", commands: ["workbench.debug.action.focusWatchView"] }, //监视表达式
  { name: "调用堆栈", commands: ["workbench.debug.action.focusCallStackView"] }, //调用堆栈
  { name: "断点", commands: ["workbench.debug.action.focusBreakpointsView"] }, //断点
  {
    name: "已载入的脚本",
    commands: ["workbench.debug.loadedScriptsView.focus"],
  }, //已载入的脚本
  {
    key: "<Space> X",
    name: "变量:全部折叠",
    commands: ["内部命令"]
  }, //
  {
    key: "<Space> A",
    name: "监视:添加表达式",
    commands: ["内部命令"]
    // commands: ["command:workbench.debug.viewlet.action.addWatchExpression"]
  }, //
  {
    key: "<Space> R",
    name: "监视:删除所有表达式",
    commands: ["内部命令"]
    // commands: [
    //   "command:workbench.debug.viewlet.action.removeAllWatchExpressions"
    // ]
  }, //
  {
    key: "<Space> C",
    name: "监视:全部折叠",
    commands: ["内部命令"]
    // commands: ["command:watch.collapse"]
  }, //
  {
    key: "<Space> D",
    name: "调用堆栈:禁用源映射单步执行",
    commands: ["内部命令"]
    // commands: ["command:extension.js-debug.disableSourceMapStepping"]
  }, //
  {
    key: "<Space> F",
    name: "调用堆栈:启用源映射单步执行",
    commands: ["内部命令"]
    // commands: ["command:extension.js-debug.enableSourceMapStepping"]
  }, //
  {
    key: "<Space> B",
    name: "调用堆栈:全部折叠",
    commands: ["内部命令"]
    // commands: ["command:callStack.collapse"]
  }, //
  {
    key: "<Space> N",
    name: "已载入的脚本:全部折叠",
    commands: ["内部命令"]
    // commands: ["workbench.debug.loadedScriptsView.focus", "command:loadedScripts.collapse"]
  }, //
  {
    key: "<Space> S",
    name: "断点:添加函数断点",
    commands: ["内部命令"]
    // commands: [
    //   "command:workbench.debug.viewlet.action.addFunctionBreakpointAction"
    // ]
  }, //
  {
    key: "<Space> G",
    name: "断点:切换激活断点",
    commands: ["内部命令"]
    // commands: [
      // "command:workbench.debug.viewlet.action.toggleBreakpointsActivatedAction"
    // ]
  }, //
  {
    key: "<Space> T",
    name: "断点:删除所有断点",
    commands: ["内部命令"]
    // commands: ["command:workbench.debug.viewlet.action.removeAllBreakpoints"]
  } //
];
const scmSiderBar = [
  { name: "初始化仓库", commands: ["git.init"] },
  // { name: "参阅我们的文档", commands: [], http: 'https://code.visualstudio.com/docs/sourcecontrol/overview' },
  { name: "发布到 GitHub", commands: ["command:github.publish"] }
]
class FileTreeDataProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.memo = {};
    // this.g11 = "ASDFGHJKLWERTYUIOVNBMZXC;".split("");
    this.g1 = "SADJKL;".split("");
    this.g2 = "SADJKLEWCMPGH".split("");
    this.keys = []; //'ASDFGHJKLWERTYUIOVNBMZXC;'.split('');
    //创建对象的时候计算，计算一次，防止多次运行，每次都从头计算导致重复。（一开始放到了generateShortcut方法中，这个方法会被多次调用每次都从头计算，导致重复了）
    //最好使用单利模式，预防重复
    // 生成2个字母的组合
    // for (let i = 0; i < this.g11.length; i++) {
    //   for (let j = 0; j < this.g11.length; j++) {
    //     this.keys.push(this.g11[i] + this.g11[j]);
    //   }
    // }
    for (let index = 0; index < this.g1.length; index++) {
      for (let index2 = 0; index2 < this.g2.length; index2++) {
        const element = this.g1[index];
        const element2 = this.g2[index2];
        this.keys.push(element+element2)
      }
    }
    this.keys.concat(this.g2);

    // this.total = 0;
    this.souPathOComMap = new Map();
    this.activityBarMap = new Map();
    this.searchBarMap = new Map();
    this.scmBarMap = new Map();
    this.debugBarMap = new Map();
  }

  async refresh(needFresh = []) {
    // if (this.searchBarMap.size === 0) {
    //   this.getActivityBar();
    //   this.getSearchSiderBar();
    // }
    this.clear()
    this.getActivityBar();
    for (const need of needFresh) {
      if (need === "explorer") {
        await this.loadFiles();
      } else if (need === "search") {
        this.getSearchSiderBar();
      } else if(need === "scm"){
        this.getScmSiderBar()
      }else if (need === "debug") {
        this.getDebugSiderBar();
      }
    }
    // needFresh.forEach(async need => {
    //   if(need === 'explorer') {
    //     await this.loadFiles();
    //   } else if(need === 'search') {
    //     this.getSearchSiderBar();
    //   }
    // })
    this._onDidChangeTreeData.fire();
  }
  clear() {
    this.souPathOComMap.clear();
    this.activityBarMap.clear();
    this.searchBarMap.clear();
    this.scmBarMap.clear();
    this.debugBarMap.clear();
    this.memo = {};
  }

  async findFilesWithExclusions() {
    if (!vscode.workspace.workspaceFolders) return [];

    // 获取用户配置的排除规则
    const filesExclude = vscode.workspace
      .getConfiguration("files")
      .get("exclude", {});
    const searchExclude = vscode.workspace
      .getConfiguration("search")
      .get("exclude", {});

    const exclude = {
      ...filesExclude,
      ...searchExclude,
      "**/.vscode": true
    };
    // const excludeGlob = Object.keys(exclude).filter(pattent => exclude[pattent]).join(',');
    // ✅const excludeGlob = "**/.git,**/.svn,**/.hg,**/.DS_Store,**/Thumbs.db,**/node_modules/**,**/bower_components,**/*.code-search,**/.vscode";
    // ❌const excludeGlob = "**/{.git,.svn,.hg,.DS_Store,Thumbs.db,node_modules,bower_components,*.code-search,.vscode}";

    let excludeGlob = Object.keys(exclude)
      .filter((pattent) => exclude[pattent])
      .map((pattent) => pattent.slice(3))
      .join(",");
    excludeGlob = "**/{" + excludeGlob + "}";

    // 执行搜索
    const uris = await vscode.workspace.findFiles("**/*", excludeGlob);
    return uris;
  }

  async loadFiles() {
    const uris = await this.findFilesWithExclusions();

    uris.forEach((uri, index) => {
      const shortcuts = this.generateShortcut(26 + index);
      const basepath = path.basename(uri.fsPath);
      this.souPathOComMap.set(shortcuts, {
        name: basepath,
        shortcuts: shortcuts,
        path: uri.fsPath
      });
    });
  }

  getActivityBar() {
    activityBar.forEach((bar, index) => {
      // console.log("activity:", index);
      const hasComm = activityBar[index].commands.length > 0;
      const shortcuts = hasComm ? this.generateShortcut(index): '没有快捷键'+index;
      this.activityBarMap.set(shortcuts, {
        name: activityBar[index].name,
        shortcuts: shortcuts,
        path: activityBar[index].commands
      });
    });
  }
  getSearchSiderBar() {
    searchSiderBar.forEach((bar, index) => {
      // console.log("search:", index);
      const hasComm = searchSiderBar[index].commands.length > 0;
      const shortcuts = hasComm ? this.generateShortcut(10 + index): '没有快捷键'+index;
      this.searchBarMap.set(shortcuts, {
        name: searchSiderBar[index].name,
        shortcuts: shortcuts,
        path: searchSiderBar[index].commands
      });
    });
  }
  getScmSiderBar() {
    scmSiderBar.forEach((bar, index) => {
      const hasComm = scmSiderBar[index].commands.length > 0;
      const shortcuts = hasComm ? this.generateShortcut(10 + index): '没有快捷键'+index;
      this.scmBarMap.set(shortcuts, {
        name: scmSiderBar[index].name,
        shortcuts: shortcuts,
        path: scmSiderBar[index].commands,
      }); 
    });
  }
  getDebugSiderBar() {
    debugSiderBar.forEach((bar, index) => {
      // console.log("search:", index);
      const hasComm = debugSiderBar[index].commands.length > 0;
      const shortcuts = hasComm ? this.generateShortcut(10 + index): '没有快捷键'+index;
      this.debugBarMap.set(shortcuts, {
        name: debugSiderBar[index].name,
        shortcuts: shortcuts,
        path: debugSiderBar[index].commands,
        key: debugSiderBar[index].key
      });
    });
  }

  // /**
  //  *
  //  * @param {object} uri 数组元素 file对象从files迭代
  //  * @param {number} index 数组下标
  //  * @returns
  //  */
  // getFiles(uri, index) {
  //   const shortcuts = this.generateShortcut(index);
  //   const basepath = path.basename(uri.fsPath);
  //   this.souPathOComMap.set(shortcuts, {
  //     name: basepath,
  //     shortcuts: shortcuts,
  //     path: uri.fsPath
  //   });
  // }

  generateShortcut(index) {
    // Precompute cumulative limits for each character group combination and round them to integers
    // this.cumulativeLimits = [
    //   { limit: 56, firstGroup: this.top, secondGroup: this.top }, // Math.floor(81 * 0.7)
    //   { limit: 132, firstGroup: this.top, secondGroup: this.two }, // Math.floor((81 + 108) * 0.7)
    //   { limit: 157, firstGroup: this.top, secondGroup: this.three }, // Math.floor((81 + 108 + 36) * 0.7)
    //   { limit: 189, firstGroup: this.two, secondGroup: this.three }, // Math.floor((81 + 108 + 36 + 48) * 0.7)
    //   { limit: 289, firstGroup: this.two, secondGroup: this.two }, // Math.floor((81 + 108 + 36 + 48 + 144) * 0.7)
    //   { limit: 299, firstGroup: this.three, secondGroup: this.three } // Math.floor((81 + 108 + 36 + 48 + 144 + 16) * 0.7)
    // ];
    // this.maxTotal = this.cumulativeLimits[this.cumulativeLimits.length - 1].limit;

    //   if (this.total >= this.maxTotal) {
    //     console.error("No more unique shortcuts can be generated.");
    //     return null;
    //   }

    //   const threshold = this.cumulativeLimits.find(t => this.total < t.limit);
    //   const num1 = Math.random();
    //   const num2 = Math.random();

    //   const firstChar = threshold.firstGroup[Math.floor(num1 * threshold.firstGroup.length)];
    //   const secondChar = threshold.secondGroup[Math.floor(num2 * threshold.secondGroup.length)];

    //   const shortcut = `${firstChar}${secondChar}`;

    //   if (this.memo[shortcut]) {
    //     return this.generateShortcut(); // Recursive call without index parameter
    //   } else {
    //     this.total++;
    //     this.memo[shortcut] = true; // Mark this shortcut as used
    //     return shortcut;
    //   }
    // }
    // let firstChar = 65 + Math.floor(index / 26); //26个1组 A A....26个, B B...26个
    // let secondChar = 65 + index % 26; // A B C....Z  A B C ...Z
    // let shortcuts = String.fromCharCode(firstChar) + String.fromCharCode(secondChar);
    // if(this.memo[shortcuts]) {
    //   return this.generateShortcut(index+1);
    // } else {
    //   this.memo[shortcuts] = true;
    //   return shortcuts;
    // }
    // this.g11[Math.floor(index / 9)]
    // this.g12[Math.floor(index % 21)]

    // this.g21[Math.floor(index / 21)]
    // this.g22[Math.floor(index % 16)]

    // this.g12[Math.floor(index / 21)];
    // this.g3[Math.floor(index / 4)];

    // if (index > 649 - 25) return "No more shortcuts..."; //25*25+25
    if (index > 169) return "No more shortcuts..."; //

    const shortcuts = this.keys[index];
    const memoKey = Object.keys(this.memo);
    // console.log('memo: ',memoKey, shortcutsAA
    const startLetterIsSame = memoKey.some((key) => {
      //当前输入的键以历史中的键开头，如当前AA,历史中A,  当前A,历史中AA
      // console.log(key, shortcuts,shortcuts.startsWith(key), index);
      return shortcuts.startsWith(key);
    });
    if (startLetterIsSame) {
      return this.generateShortcut(index + 1);
    } else {
      this.memo[shortcuts] = true;
      return shortcuts;
    }
  }

  // 在fileTreeDataProvider.js的getTreeItem中
  // getTreeItem(node) {
  //   console.log('Rendering node:', node); // 添加调试日志
  //   return {
  //     label: `${node.name} [${node.shortcut}]`,
  //     // collapsibleState: vscode.TreeItemCollapsibleState.Expanded, // 默认展开 <button class="citation-flag" data-index="7">
  //     iconPath: vscode.ThemeIcon.File,
  //     command: {
  //       command: 'fileShortcuts.openFile',
  //       arguments: [node.uri],
  //       title: "Open File"
  //     },
  //     contextValue: 'fileNode'
  //   };
  // }

  // getChildren() {
  //   return this.files;
  // }
  // async getChildren() {
  //   const files = await vscode.workspace.findFiles('**/*');
  //   return files.map((uri, index) => ({
  //     uri,
  //     name: path.basename(uri.fsPath),
  //     shortcut: this.generateShortcut(index)
  //   }));
  // }
}

module.exports = FileTreeDataProvider;
