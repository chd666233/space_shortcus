# Space Shortcuts README



## Features

便捷的导航，在没有鼠标时，有时需要使用触摸板将光标滑过长长的路程，从屏幕左边到右边，然后点击按钮，

## Requirements



## Extension Settings

* `Alt+Space`: 开启插件。导航后自动关闭。或者关闭webview页面自动结束插件运行。

## Known Issues
1. 插件运行期间会占用空格键
2. 因为vscode的限制，无法动态获取通过快捷键、通过点击切换活动栏，自动更新导航菜单。
3. 因为vscode的限制，无法动态在代码执行指令中加入when部份，所以例如在debug活动栏，在debuge未start时，应该隐藏在start后才能显示的导航，实际上没有隐藏，因为无法准确判断目前的状态。
4. 第3点附带，有时候匹配了,如space d,但是指令没有执行，并且显示组合键不是命令。
5. webview页面有时候会失去焦点，例如频繁的alt+space打开。失去焦点后输入讲不能显示到页面高亮。但是插件还是激活的，keybindings还能激活space+x等的快捷键。


## Release Notes


### 1.0.0
基础功能
### 1.0.1
插件图标
### 1.0.2
尝试修复space在插件关闭后占用问题



