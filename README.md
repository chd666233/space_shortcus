# Space Shortcuts README



## Features

1.便捷的导航，适用于没有鼠标，使用触摸板滑过长长的光标，从屏幕左边到右边的距离，然后点击按钮。
2.实时显示输入。

## Requirements



## Extension Settings

* `Alt+Space`: 开启插件。导航后自动关闭。或者关闭webview页面自动结束插件运行。

## Known Issues
1. 插件运行期间会占用空格键
2. 因为vscode的限制，无法动态获取通过快捷键、通过点击切换活动栏，自动更新导航菜单。
3. 因为vscode的限制，无法动态在代码执行指令中加入when部份，所以例如在debug活动栏，在debuge未start时，应该隐藏在start后才能显示的导航，实际上没有隐藏，包含了start后才能显示的导航，因为无法准确判断目前的状态。
4. webview页面有时候会失去焦点，例如频繁的alt+space打开。失去焦点后输入讲不能显示到页面高亮。但是插件还是激活的，keybindings还能激活space+x等的快捷键。


## Release Notes


### 1.0.0



