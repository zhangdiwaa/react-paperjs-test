import React from "react";
import {
    ToolMove,
    ToolDrawCircle,
    ToolDrawRect,
    ToolDrawSegment,
    ToolEditPath,
    ToolEnlarge,
    ToolShrink,
    BezierTool,
    ToolZoomauto
} from "../MyCanvas/PaperTools"
import PointText from "../MyCanvas/PointText"
import Shape from "../MyCanvas/shape"
import Brush from "../MyCanvas/Brush"
import Color from "../MyCanvas/Color"
import { Button, Layout, Tooltip } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import Config from "../Common/Config";
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});
const IconFont2 = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1764899_r5j3hzvw73.js',
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
            case 'segment': return ToolDrawSegment;
            case 'edit': return ToolEditPath;
            case 'enlarge': return ToolEnlarge;
            case 'shrink': return ToolShrink;
            case 'zoomauto': return ToolZoomauto;
            case 'pen':return BezierTool;
        }
    }

    return (
        <Sider width={48} className="me-left-bar">
            <div>
                <Tooltip placement="right" title={"brush"}>
                    <Brush/>
                </Tooltip>
                <Tooltip placement="right" title={"pen"}>
                    <Button onClick={FunctionMap("pen")}><IconFont2 type="icon-gangbi" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"shape"}>
                    <Shape/>
                </Tooltip>
                <Tooltip placement="right" title={"translate"}>
                    <Button onClick={FunctionMap("translate")}><IconFont type="icon-hand" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"text"}>
                    <PointText />
                </Tooltip>
                <Tooltip placement="right" title={"edit"}>
                    <Button onClick={FunctionMap("edit")}><IconFont type="icon-Link-Select" /></Button>
                </Tooltip>
                <Tooltip placement="right" title={"color"}>
                    <Color/>
                </Tooltip>
            </div>
        </Sider>
    )
}



export default SiderBar;


