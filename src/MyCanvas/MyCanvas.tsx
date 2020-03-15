import React from "react"
import * as Paper from "paper";
import {Button, Layout, Tooltip} from 'antd';
import {useEffect} from "react";
import EventHub from "../Common/Observer";
import {PageChangeBefore, PageChangeAfter} from "../Common/UndoAndRedo"
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";
import {LoadLayer} from "../UI/Layers";
import {
    ToolZoomauto,
    ToolZoomin,
    ToolZoomout
} from "./PaperTools";

const {Content} = Layout;
const {Header} = Layout;
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});


const MyCanvas = () => {
    let MyCanvas: HTMLCanvasElement = null;
    useEffect(() => {
        Paper.install(window);
        Paper.setup(MyCanvas);
        Paper.activate();
        Paper.settings.handleSize=8//设置选中时的四个点的大小
        Paper.settings.hitTolerance=2//设置hitTest的容忍度
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
        //清空localStorage
        localStorage.setItem("history", JSON.stringify([]))
        localStorage.setItem("future", JSON.stringify([]))
        // 当观察者收到mouseDownBefore的操作之后，执行pageChangeBefore方法
        EventHub.on('pageChangeBefore', PageChangeBefore)
        // 当观察者收到pageChangeAfter的操作之后，执行PageChangeAfter方法
        EventHub.on('pageChangeAfter', PageChangeAfter)
        // 当观察者收到pageChangeAfter的操作之后，执行LoadLayer方法
        EventHub.on('pageChangeAfter', LoadLayer)
        // 当观察者收到redo的操作之后,执行LoadLayer方法
        EventHub.on('redo', LoadLayer)
        // 当观察者收到undo的操作之后,执行LoadLayer方法
        EventHub.on('undo', LoadLayer)
    });
    return (
        <Content className="me-canvas under-bottonbox">
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
                id="myCanvas"></canvas>

        </Content>

    )
}

export default MyCanvas
