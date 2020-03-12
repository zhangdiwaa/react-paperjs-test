import React from "react";
import {
    ToolMove,
    ToolDrawCircle,
    ToolDrawRect,
    ToolFreePen,
    ToolDrawSegment,
    ToolPointText,
    ToolEditPath,
    ToolRotate,
    ToolEnlarge,
    ToolShrink,
    ToolZoomauto
} from "../MyCanvas/PaperTools"
import { Button, Layout, Tooltip } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import Config from "../Common/Config";
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});
const { Sider } = Layout;

const SiderBar = () => {

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
            case 'edit': return ToolEditPath;
            case 'enlarge': return ToolEnlarge;
            case'shrink': return ToolShrink;
            case'zoomauto': return ToolZoomauto;
            case 'rotate': return ToolRotate;
        }
    }

    return (
        <Sider width={48} className="me-left-bar">
            <div>
                <Tooltip placement="right" title={"pen"}>
                    <Button onClick={FunctionMap("pen")} ><IconFont type="icon-pen" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"segment"}>
                    <Button onClick={FunctionMap("segment")}><IconFont type="icon-Line" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"circle"}>
                    <Button onClick={FunctionMap("circle")}><IconFont type="icon-Select-1" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"rect"}>
                    <Button onClick={FunctionMap("rect")}><IconFont type="icon-Select-" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"translate"}>
                    <Button onClick={FunctionMap("translate")}><IconFont type="icon-hand" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"text"}>
                    <Button onClick={FunctionMap("text")}><IconFont type="icon-text" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"enlarge"}>
                    <Button onClick={FunctionMap("enlarge")}><IconFont type="icon-zoomin" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"shrink"}>
                    <Button onClick={FunctionMap("shrink")}><IconFont type="icon-zoomout" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"zoomauto"}>
                    <Button onClick={FunctionMap("zoomauto")}><IconFont type="icon-zoom1" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"edit"}>
                    <Button onClick={FunctionMap("edit")}><IconFont type="icon-Link-Select" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"rotate"}>
                    <Button onClick={FunctionMap("rotate")}><IconFont type="icon-Link-Select" /></Button>
                </Tooltip>
            </div>
        </Sider>
    )
}



export default SiderBar;


