# Space Shortcuts README

**注意：需要先打开主侧边栏mac: shift+command+e, win: shift+ctrl+e。**
**Note: You need to open the main sidebar mac: shift+command+e, win: shift+ctrl+e.**
* `Alt+Space`: 开启插件。导航后自动关闭。或者关闭webview页面自动结束插件运行。
* `Alt+Space` : Open the plugin. Automatically shuts down after navigation. Or close the webview page to automatically end the plug-in.

## Features
便捷的导航，在没有鼠标时，有时需要使用触摸板将光标滑过长长的路程，从屏幕左边到右边，然后点击按钮。
Convenient navigation, in the absence of a mouse, sometimes need to use the touchpad to slide the cursor over a long distance, from the left side of the screen to the right, and then click the button.

## Requirements



## Extension Settings


## Known Issues
1. 插件运行期间会占用空格键

2. 因为vscode的限制，无法动态获取通过快捷键、通过点击切换活动栏，自动更新导航菜单。

3. 因为vscode的限制，无法动态在代码执行指令中加入when部份，所以例如在debug活动栏，在debuge未start时，应该隐藏在start后才能显示的导航，实际上没有隐藏，因为无法准确判断目前的状态。

4. 第3点附带，有时候匹配了,如space d,但是指令没有执行，并且显示组合键不是命令。

5. webview页面有时候会失去焦点，例如频繁的alt+space打开。失去焦点后输入讲不能显示到页面高亮。但是插件还是激活的，keybindings还能激活space+x等的快捷键。

###

1. The space bar is used when the plug-in is running

2. Due to vscode's limitations, the navigation menu cannot be updated automatically through shortcut keys or by clicking to switch the active bar.

3. Due to the limitations of vscode, it is not possible to dynamically add the when part in the code execution instruction, so for example, in the debug activity bar, when the debuge is not started, the navigation that should be hidden after start can be displayed is actually not hidden, because the current status cannot be accurately judged.

4. Attached to point 3, sometimes a match is made, such as space d, but the instruction is not executed and the key combination is not shown as a command.

5. webview pages sometimes lose focus, such as frequent alt+space openings. After losing focus, the input will not display to the page highlight. However, plugins are still active, and keybindings can activate shortcuts such as space+x.

## Release Notes


### 1.0.0
基础功能
Basic function
### 1.0.1
插件图标
Plugin icon
### 1.0.2
尝试修复space在插件关闭后占用问题
Attempts to fix an issue where space is occupied after the plugin is closed
### 1.0.3
补充使用的说明需要开启主侧边栏
Additional instructions for use need to open the main sidebar



