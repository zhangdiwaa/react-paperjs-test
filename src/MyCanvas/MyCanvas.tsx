import React, {ReactDOM, useState} from 'react';
import * as Paper from "paper";
import {Button, Layout, Tooltip} from 'antd';
import {useEffect} from "react";
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";
import {
    ToolZoomauto,
    ToolZoomin,
    ToolZoomout
} from "./PaperTools";
import {onClick} from "./keyboard";

const {Content} = Layout;
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

window.oncontextmenu=function(e){

//取消默认的浏览器自带右键
    e.preventDefault();

//获取我们自定义的右键菜单
    var menu=document.querySelector("#menu") as HTMLBaseElement;
    menu.style.width='125px';
    menu.style.left=e.clientX-50+'px';
    menu.style.top=e.clientY-50+'px';
}

const MyCanvas = () => {
    let MyCanvas: HTMLCanvasElement = null;
    useEffect(() => {
        Paper.install(window);
        window.addEventListener("keydown", onClick)
        Paper.setup(MyCanvas);
        Paper.activate();
        Paper.settings.handleSize = 8//设置选中时的四个点的大小
        Paper.settings.hitTolerance = 4//设置hitTest的容忍度

        //使用React提供的onWheel会提示“渲染过多”
        //下面这段代码是实现缩放功能的初始化
        MyCanvas.onwheel = (event) => {
            let v = Paper.view
            if (event.deltaY < 0) {
                v.scale(1.05, new Paper.Point(event.offsetX, event.offsetY))
            } else {
                v.scale(0.95, new Paper.Point(event.offsetX, event.offsetY))
            }
        }
    });

    return (
        <Content className="me-canvas under-bottonbox">
            <div id="menu">
                <div className="menu">功能1</div>
                <div className="menu">功能2</div>
                <div className="menu">功能3</div>
                <div className="menu">功能4</div>
                <div className="menu">功能5</div>
            </div>
            <div className="under-botton">
                <Tooltip placement="bottom" title={"zoomin"}>
                    <Button onClick={ToolZoomin}><IconFont type="icon-zoomin"/></Button>
                </Tooltip>
                <Tooltip placement="bottom" title={"zoomout"}>
                    <Button onClick={ToolZoomout}><IconFont type="icon-zoomout"/></Button>
                </Tooltip>
                <Tooltip placement="bottom" title={"zoomauto"}>
                    <Button onClick={ToolZoomauto}><IconFont type="icon-zoom1"/></Button>
                </Tooltip>
            </div>
            <canvas
                ref={ref => {
                    MyCanvas = ref
                }}
                /** 解决paper.js canvas缩放的办法
                 * CSS
                canvas[resize] {
                    width: 100%;
                    height: 100%;
                }
                * react jsx
                <canvas
                    ref={(el) => { this.canvas = el; }}
                    data-paper-resize="true"
                    data-paper-keepalive="true"
                />
                **/
                id="myCanvas"
                data-paper-resize="true"
                data-paper-keepalive="true"
                style={{ width: '100%', height: '100%' }}
                >
            </canvas>
        </Content>

    )
}

export default MyCanvas
