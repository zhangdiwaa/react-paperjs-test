## 🎣 本项目是一个用于将paper.js和react合写的测试demo.

### 如何开始
- Clone this repository `git clone git@github.com:zhangdiwaa/react-paperjs-test.git`
- Install the dependencies `yarn install`
- Start the app `yarn start`
- Open [http://localhost:4321](http://localhost:4321) to view it in the browser.

### 程序说明
本项目基于以下类库制作。
This project is based on:

1. react
2. typescript
3. ant design
4. paper.js

### 2020年3月7日重大修改
1. 修改了工程目录结构。现在的目录结构是:
```javascript
-  src
-  |---- MyCanvas               //与paper.js相关的功能组件
-  |---- |---- MyCanvas.tsx     //paper.js画布生成与初始化组件
-  |---- |---- PaperTool.tsx    //paper.js交互工具组件
-  |
-  |---- UI                     //界面相关的组件
-  |---- |---- HeaderBar.tsx    //界面首部及其按钮组
-  |---- |---- siderBar.tsx     //界面侧边栏及其按钮组
-  |
-  |---- Common                 //通用组件
-  |---- |---- config.tsx       //配置数组
-  |
-  |---- App.tsx                //入口组件
-  |---- App.css                //全局样式文件
-  剩余文件都是create-react-app 默认的文件
```
2. 更新了antDesign插件到4.0.1版本
- yarn upgrade-interactive --latest // 使用此命令更新依赖包。注意此命令输入后还需要手动选择升级的依赖包，按空格键选择，a 键切换所有，i 键反选选择，回车确定升级