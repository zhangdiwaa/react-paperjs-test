## 🎣 本项目是一个用于将paper.js和react合写的测试demo.

### 如何开始
- Clone this repository `git clone git@github.com:zhangdiwaa/react-paperjs-test.git`
- Install the dependencies `yarn install`
- Start the app `yarn start`

### 程序说明

- 本程序基于create-react-app编写。

- 入口文件是./src/App.js

- 使用react编写的paper.js组件有：

- ./component/Drawing_class.js  //遵循react传统写法的类式组件
- ./component/Drawing_hook.js   //遵循react hook写法的函数式组件

- 要切换组件，请在./src/App.js文件中修改import的对象文件名。
- 具体说明详见代码内注释。
