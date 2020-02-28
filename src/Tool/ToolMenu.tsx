import React, { useState } from "react";
import * as paper from "paper"
import { Button, Icon, Layout } from 'antd';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1638575_i23xlb5oazk.js',
});
const { Sider } = Layout;

const ToolMenu = () => {
    /**
     * name ToolMove
     * desc 拖拽画布
     */
    const ToolMove = () => {
        let tool: paper.Tool = new paper.Tool()
        let view: paper.View = paper.view;
        tool.onMouseDrag = (event: paper.ToolEvent) => {
            view.translate(event.point.subtract(event.downPoint))
        }
    }
     /**
     * name ToolDrawCircle
     * desc 画圆
     */
    const ToolDrawCircle = () => {

        let tool: paper.Tool = new paper.Tool()
        tool.onMouseDrag = (event: paper.ToolEvent) => {
            let path: paper.Path.Circle = new paper.Path.Circle({
                center: event.downPoint,
                radius: event.downPoint.subtract(event.point).length,
                strokeColor: "black"
            })
            path.removeOnDrag()
        }
    }
     /**
     * name ToolDrawRect
     * desc 画方
     */
    const ToolDrawRect = () => {
        let tool: paper.Tool = new paper.Tool()
        tool.onMouseDrag = (event: paper.ToolEvent) => {
            let path: paper.Path.Rectangle = new paper.Path.Rectangle({
                from: event.downPoint,
                to: event.point,
                strokeColor: "black"
            })
            path.removeOnDrag()
        }
    }

    //工具映射函数
    const FunctionMap = (ToolType: string) => {
        //先清除所有的工具
        paper.tools.forEach((item) => {
            item.remove()
        })
        //根据类型选择对应的函数
        switch (ToolType) {
            case 'circle': return ToolDrawCircle; 
            case 'translate': return ToolMove; 
            case 'rect': return ToolDrawRect; 
        }
    }
    return (
        <Sider width={48} className="me-left-bar">
            <div>
                <Button type="primary" shape="circle"><IconFont type="icon-pen" /></Button>
                <Button type="primary" shape="circle" ><IconFont type="icon-Line" /></Button>
                <Button type="primary" shape="circle" onClick={FunctionMap("circle")}><IconFont type="icon-Select-1" /></Button>
                <Button type="primary" shape="circle" onClick={FunctionMap("rect")}><IconFont type="icon-Select-" /></Button>
                <Button type="primary" shape="circle" onClick={FunctionMap("translate")}><IconFont type="icon-hand" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Text-box" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-zoom" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Link-Select" /></Button>
            </div>
        </Sider>
    )
}



export default ToolMenu;