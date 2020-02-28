import React, { useState } from "react";
import * as paper from "paper"
import { Button, Icon, Layout, Tooltip } from 'antd';
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
        RemoveTool()
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
        RemoveTool()
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
        RemoveTool()
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
    /**
    * name ToolFreePen
    * desc 画笔
    */
    const ToolFreePen = () => {
        RemoveTool()
        let tool: paper.Tool = new paper.Tool()
        tool.minDistance = 10;

        let path: paper.Path = new paper.Path({
            strokeColor: "black"
        })
        //每当鼠标按下就新建一条路径
        tool.onMouseDown = (event: paper.ToolEvent) => {
            path = new paper.Path({
                strokeColor: "black"
            })
        }
        tool.onMouseDrag = (event: paper.ToolEvent) => {
            path.add(event.point)
            path.removeOnDrag()
        }
    }

    /**
    * name ToolDrawSegment
    * desc 画线段
    */
    const ToolDrawSegment = () => {
        RemoveTool()
        let tool: paper.Tool = new paper.Tool()
        tool.onMouseDrag = (event: paper.ToolEvent) => {
            let path: paper.Path = new paper.Path({
                strokeColor: "black"
            })
            path.add(event.downPoint, event.point);
            path.removeOnDrag()
        }
    }
    /**
    * name ToolPointText
    * desc 写字
    */
    const ToolPointText = () => {
        RemoveTool()
        let tool: paper.Tool = new paper.Tool()
        tool.onMouseDown = (event: paper.ToolEvent) => {
            let text: paper.PointText = new paper.PointText({
                point: event.downPoint,
                content: 'wawa',
                fillColor: 'black',
                fontFamily: 'Courier New',
                fontWeight: 'bold',
                fontSize: 25
            });
        }
    }

    //清除所有工具的辅助函数，每一个工具函数使用前都要先执行
    const RemoveTool = () => {
        console.log(paper.tools)
        //先清除所有的工具
        paper.tools.forEach((item) => {
            item.remove()
        })
    }

    //工具映射函数
    const FunctionMap = (ToolType: string) => {
        //根据类型选择对应的函数
        switch (ToolType) {
            case 'circle': return ToolDrawCircle;
            case 'translate': return ToolMove;
            case 'rect': return ToolDrawRect;
            case 'pen': return ToolFreePen;
            case 'segment': return ToolDrawSegment;
            case 'text': return ToolPointText;
        }
    }

    return (
        <Sider width={48} className="me-left-bar">
            <div>
                <Tooltip placement="right" title={"pen"}>
                    <Button type="primary" shape="circle" onClick={FunctionMap("pen")} ><IconFont type="icon-pen" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"segment"}>
                    <Button type="primary" shape="circle" onClick={FunctionMap("segment")}><IconFont type="icon-Line" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"circle"}>
                    <Button type="primary" shape="circle" onClick={FunctionMap("circle")}><IconFont type="icon-Select-1" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"rect"}>
                    <Button type="primary" shape="circle" onClick={FunctionMap("rect")}><IconFont type="icon-Select-" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"rect"}>
                    <Button type="primary" shape="circle" onClick={FunctionMap("translate")}><IconFont type="icon-hand" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"text"}>
                    <Button type="primary" shape="circle" onClick={FunctionMap("text")}><IconFont type="icon-Text-box" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"zoom"}>
                    <Button type="primary" shape="circle"><IconFont type="icon-zoom" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"select"}>
                    <Button type="primary" shape="circle"><IconFont type="icon-Link-Select" /></Button>
                </Tooltip>
                
            </div>
        </Sider>
    )
}



export default ToolMenu;