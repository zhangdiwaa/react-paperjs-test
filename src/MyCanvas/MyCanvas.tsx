import React from "react"
import * as Paper from "paper";
import { Layout } from 'antd';
import { useEffect } from "react";
const { Content } = Layout;


const MyCanvas=()=>{
    let myCanvas:HTMLCanvasElement = null;

    useEffect(() => {
        Paper.install(window);
        Paper.setup(myCanvas)
    });
    return (
        <Content className="me-canvas">
          <canvas 
          ref={ref=>{myCanvas=ref}}
          id="myCanvas"></canvas>
        </Content>
    )
}
export default MyCanvas