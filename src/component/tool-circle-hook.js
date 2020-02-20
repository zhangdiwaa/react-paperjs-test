import React, { useState, useEffect } from 'react';
import Paper from "paper";
import { isCompositeComponent } from 'react-dom/test-utils';
//遵循facebook hooks编程方法的函数式组件
const Drawing = () => {
    /* myCanvas变量用来捕获dom元素，使用ref来捕获，初始赋值为空 */
    let myCanvas = null;
    /* paper.js中的路径函数 */
    let path = null;
    // /* 模仿react-paper-bindings的写法，保存当前状态 */
    // let [state, setState] = useState({
    //     activeTool: 'move',
    //     animate: false,
    //     circles: [],
    //     rectangles: [],
    //     rotation: 0,
    //     cx: 0,
    //     cy: 0,
    //     dx: 0,
    //     dy: 0,
    //     x: 0,
    //     y: 0,
    //     zoom: 1
    // });

    /*
        Effect Hook 用于执行函数组件中的副功能，相当于
        componentDidMount （class组件 挂载/实例化 时执行的操作）
        componentDidUpdate （class组件 被重新渲染 时可执行的操作）
        componentWillUnmount（class组件 被卸载/销毁 时时可执行的操作）
        这三个函数的组合。
        详见：https://react.docschina.org/docs/hooks-reference.html
        这里用来执行paper.js的画板初始化的功能。
        这意味着每次重新绘图，都刷新一下画板
    */
    useEffect(() => {
        Paper.setup(myCanvas);
        Paper.project.clear();
        draw();
    });

    //画图函数
    const draw = () => {
        let cir = new Paper.Path.Circle(Paper.view.center, 20);
        cir.strokeColor = "red";
    }

    //画图交互事件函数
    const addCircle = (e) => {
        /*
            注意这里的e是react的event，不是paper.js的tool的event
            所以坐标位置要重新转换
        */
        let point = new Paper.Point(
            e.clientX - e.target.offsetLeft,
            e.clientY - e.target.offsetTop
        )
        console.log(point);

        let path = new Paper.Path.Circle({
            center: point,
            radius: 10, //(event.downPoint - event.point).length,
            fillColor: 'white',
            strokeColor: 'black'
        });

        console.log(path.position)
        // Remove this path on the next drag event:
        path.removeOnDrag();


    };

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
                /*react鼠标事件列表 https://react.docschina.org/docs/events.html#clipboard-events */
                onMouseDown={addCircle}
                style={{ border: "1px solid #000", height: "500px", width: "500px" }}
                id="myCanvas"
                className="backgroundCanvas"
            />
        </div>
    );
}

export default Drawing;
