import * as React from "react"
import { Button, Icon } from 'antd';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1638575_i23xlb5oazk.js',
});
//ts下写React组件，必须写清楚类型声明，state的类型如下
export interface Props{
    toolHandle:Function//接受父组件传来的 设置工具函数作用的 函数
}
export interface State{
    toolType:string
}

export default class ToolMenu extends React.Component<Props,State>{
    constructor(props:Readonly<Props>){
        super(props);
    }
    //state必须是readonly，以下是对ES的赋值
    readonly state:State={
        toolType:""
    }
    //按钮的点击事件
    handlePenClick(event){
        this.state.toolType="Pen";
        this.props.toolHandle(this.state.toolType);//根据点击的按钮获取工具类型字符串传入父组件传来的toolHandle
    }
    handleLineClick(event){
        this.state.toolType="Line"
    }
    handleSelect1Click(event){
        this.state.toolType="Select1"
    }
    handleSelect2Click(event){
        this.state.toolType="Select2"
    }
    handleHandClick(event){
        this.state.toolType="Hand"
    }
    handleTextClick(event){
        this.state.toolType="Text"
    }
    handleZoomClick(event){
        this.state.toolType="Zoom"
    }
    handleLineSelectClick(event){
        this.state.toolType="LineSelect"
    }

    render(){
        return (
            <div>
                <Button type="primary" shape="circle" onClick={this.handlePenClick.bind(this)}><IconFont type="icon-pen" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Line" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Select-1" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Select-" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-hand" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Text-box" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-zoom" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Link-Select" /></Button>
            </div>
        )
    }
}