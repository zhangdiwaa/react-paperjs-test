//import * as xxx from "xxx"是引入实例，import xxx from "xxx"是引入组件
import * as React from "react";
import Sidebar from "./Sidebar"
import eventSet from "../Tool/EventSet/eventset";

interface State{
    functionMap:{[type:string]:Function}//函数字典
}
interface Props{
    interfaceFunction?:Function
}

export default class DrawHandle extends React.Component<Props,State>{
    constructor(props:Readonly<Props>){
        super(props)
    }
    readonly state:State={
        functionMap:{'Pen':draw1}//在此绑定每个工具类型所用的函数
    }
    //将函数字典传入子组件Sidebar
    render(){
        return (
            <Sidebar functionMap={this.state.functionMap}></Sidebar>
        );
    }
}








//下面使用react hook,但是我没有使用react hook
const draw1=(eventSet:eventSet)=>{
//开始初始化一个图形
    let glyph=new paper.Shape.Circle(eventSet.mouseDownEvent.point)
    glyph.strokeColor=new paper.Color("black");
    console.log(eventSet)
    draw2(eventSet,glyph)
}
const draw2=(eventSet:eventSet,glyph:any)=>{
    var Timer=setInterval(()=>{
        let radius=eventSet.mouseDragEvent.downPoint.getDistance(eventSet.mouseDragEvent.point)
        glyph.radius=radius;
        if(eventSet.isUp){
            clearInterval(Timer)
            draw3(eventSet)
        }
    },33)
}
const draw3=(eventSet:eventSet)=>{
    console.log("清除了Timer")
}