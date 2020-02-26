//ts中引入的写法
import * as React from "react";
import ToolMenu from "../Tool/ToolMenu"
import eventSet from "../Tool/EventSet/eventset"

export interface Props{
    functionMap:{[type:string]:Function}//接受传过来的函数字典
}
export interface State{
    toolFunction:Function
    eventSet:eventSet//自己封装的事件集合
}

//此处应该有个数据处理层
export default class Sidebar extends React.Component<Props,State>{
    constructor(props:Readonly<Props>){
        super(props);
    }
    readonly state:State={
        toolFunction:null,
        eventSet:new eventSet(this)
    }
    //eventSet中的此函数到后期可以替换成 函数map，以处理多个值的更新
    updateSomething(eventSet:eventSet){
        if(this.state.toolFunction!=null)
        this.state.toolFunction(eventSet)
    }
    //toolHandle函数传入ToolMenu组件中，以便设置工具类型以及该工具所用的函数
    toolHandle(type:string){
        let f=this.props.functionMap[type]
        this.setState({
            toolFunction:f
        })
    }
    //调用toolFunction
    render(){
        //bind之后，函数的作用域就是父组件的作用域了
        return (
            <ToolMenu toolHandle={this.toolHandle.bind(this)}></ToolMenu>
        );
    };
}
