import React from "react"
import * as Paper from "paper";
import { Layout } from 'antd';
import { useEffect } from "react";
const { Content } = Layout;


const MyCanvas=()=>{
    let MyCanvas:HTMLCanvasElement = null;
    useEffect(() => {
        Paper.install(window);
        Paper.setup(MyCanvas);
        //使用React提供的onWheel会提示“渲染过多”    
        //下面这段代码是实现缩放功能的初始化
        MyCanvas.onwheel=(event)=>{
            let v=Paper.view
            if(event.deltaY<0){
                v.scale(1.05,new Paper.Point(event.offsetX,event.offsetY))
            }else{
                v.scale(0.95,new Paper.Point(event.offsetX,event.offsetY))
            }
        }
    });
    return (
        <Content className="me-canvas">
          <canvas 
          ref={ref=>{MyCanvas=ref}}
          id="myCanvas"></canvas>
        </Content>
    )
}

export default MyCanvas