import React from "react";
import * as paper from "paper"
import { Button , Icon ,Layout} from 'antd';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1638575_i23xlb5oazk.js',
});
const {Sider}=Layout;

const ToolMenu=()=>{
    return (
        <Sider width={48} className="me-left-bar">
            <div>
                <Button type="primary" shape="circle" onClick={DrawTest}><IconFont type="icon-pen" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Line" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Select-1" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Select-" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-hand" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Text-box" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-zoom" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Link-Select" /></Button>
            </div>
        </Sider>
    )
}

const DrawTest=()=>{
    let tool:paper.Tool=new paper.Tool()
    tool.onMouseDrag=(event:paper.ToolEvent)=>{
        let path:paper.Path.Circle=new paper.Path.Circle({
            center: event.downPoint,
            radius: event.downPoint.subtract(event.point).length,
            strokeColor: "black"
        })
        path.removeOnDrag()
    }
}

export default ToolMenu;