import React, { useEffect } from 'react';
import Paper from "paper";
//遵循facebook hooks编程方法的函数式组件
const Drawing = () => {
    /*myCanvas变量用来捕获dom元素，使用ref来捕获，初始赋值为空 */
    let myCanvas = null;
    /*
        Effect Hook 用于执行函数组件中的副功能，相当于
        componentDidMount （class挂在实例化时执行的操作）
        componentDidUpdate （class组件被重新渲染时可执行的操作）
        componentWillUnmount（class组件被卸载销毁时时可执行的操作）
        这三个函数的组合。
        这里用来执行paper.js的画板初始化功能。
        这意味着每次重新绘图，都刷新一下画板
    */
    useEffect(() => {
        console.log(myCanvas)
        Paper.setup(myCanvas);
        Paper.project.clear();
        draw();
        Paper.project.view.scale(0.8);
    });

    //画图函数
    const draw = () => {
        let cir = new Paper.Path.Circle(Paper.view.center, 20);
        cir.strokeColor = "red";
    }

    //JSX模板
    return (
        <div
            style={{
                padding: "10px",
                margin: "10px",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "row",
                alignItems: "center"
            }}
        >
            <canvas
                /*
                The ref attribute takes a callback function, 
                and the callback will be executed immediately
                    const callback = ref => { 
                        myCanvas = ref; 
                    }
                When the ref attribute is used on an HTML element, 
                the ref callback receives the underlying DOM element as its argument.
                 */
                ref={ref => { myCanvas = ref }}
                style={{ border: "1px solid #000", height: "500px", width: "500px" }}
                id="myCanvas"
                className="backgroundCanvas"
            />
        </div>
    );
}

export default Drawing;
