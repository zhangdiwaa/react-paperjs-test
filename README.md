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

### 目录结构
```javascript
-  src
-  |---- MyCanvas               //与paper.js相关的功能组件
-  |---- |---- MyCanvas.tsx     //主画布生成与初始化组件
-  |---- |---- PaperTool.tsx    //paper.js交互工具组件
-  |
-  |---- UI                     //界面相关的组件
-  |---- |---- HeaderBar.tsx    //界面首部及其按钮组
-  |---- |---- siderBar.tsx     //界面侧边栏及其按钮组
-  |---- |---- Layers.tsx       //界面右下角图层列表
-  |---- |---- Overview.tsx     //界面右上角概览视图
-  |
-  |---- Common                 //通用组件
-  |---- |---- Config.tsx       //配置相关json
-  |---- |---- Observer.tsx     //发布订阅模式功能
-  |---- |---- UndoAndRedo.tsx  //撤销和重做功能  
-  |
-  |---- App.tsx                //入口组件
-  |---- App.css                //全局样式文件
-  剩余文件都是create-react-app 默认的文件
```

### 注意依赖类库的更新

更新了antDesign插件到4.0.2版本
- yarn upgrade-interactive --latest // 使用此命令更新依赖包。注意此命令输入后还需要手动选择升级的依赖包，按空格键选择，a 键切换所有，i 键反选选择，回车确定升级
经测试，可以使用如上更新函数更新全部依赖，不会出现冲突。
