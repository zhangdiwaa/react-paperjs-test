import React from "react";
import {
    ToolMove,
    ToolDrawCircle,
    ToolDrawRect,
    ToolFreePen,
    ToolDrawSegment,
    ToolPointText,
    ToolEditPath,
    ToolEnlarge,
    ToolShrink,
    ToolZoomauto
} from "../MyCanvas/PaperTools"
import { Button, Layout, Tooltip } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import PointText from '../MyCanvas/PointText'
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
                    <PointText ><IconFont type="icon-text" /></PointText>
                </Tooltip>
                <Tooltip placement="right" title={"edit"}>
                    <Button onClick={FunctionMap("edit")}><IconFont type="icon-Link-Select" /></Button>
                </Tooltip>
             
            </div>
        </Sider>
    )
}



export default SiderBar;


