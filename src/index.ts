/*
这是软件的入口ts文件。
没有使用模块CoordinateSystem和Element，所以看代码时请忽略这两个文件夹。
*/

import { RectTool,CircleTool, CurveTool, LineTool, EllipseTool } from "./app/Tool/tool";
import * as Layer from "./app/Layer/layer";
import * as paper from "paper";
var lastTool:any=null;
var circleTool:CircleTool;
var rectTool:RectTool;
var curveTool:CurveTool;
var lineTool:LineTool;
var ellipseTool:EllipseTool;
var layer:Layer.Layer; 
var drawLayoutFlag:boolean;
var layoutTool:any=null;

window.onload=function(){
    //创建绘图工具
    circleTool=new CircleTool("ShowPanel",true);
    rectTool=new RectTool("ShowPanel",true);
    curveTool=new CurveTool("ShowPanel",true);
    layoutTool=lastTool=lineTool=new LineTool("ShowPanel",true);
    ellipseTool=new EllipseTool("ShowPanel",true);

    drawLayoutFlag=false;//`是否为布局绘画`
    layer=new Layer.Layer();//新图层

    //将绘图工具挂起，使其处于未激活状态
    rectTool.hangUp();
    circleTool.hangUp();
    curveTool.hangUp();
    lineTool.hangUp();
    ellipseTool.hangUp();
    
    //使html里按键绑定工具的激活函数
    document.getElementById("RectTool").onclick=function(){
        drawLayoutFlag=false;//设置`是否为布局绘画`为false
        if(lastTool!=null){
            lastTool.hangUp();//挂起上一个绘画工具
        }
        rectTool.activate();//激活矩形绘画工具
        lastTool=rectTool;
    }
    document.getElementById("CircleTool").onclick=function(){
        drawLayoutFlag=false;
        if(lastTool!=null){
            lastTool.hangUp();
        }
        circleTool.activate();
        lastTool=circleTool;
    }
    document.getElementById("CurveTool").onclick=function(){
        drawLayoutFlag=false;
        if(lastTool!=null){
            lastTool.hangUp();
        }
        curveTool.activate();
        lastTool=curveTool;
    }
    document.getElementById("LineTool").onclick=function(){
        drawLayoutFlag=false;
        if(lastTool!=null){
            lastTool.hangUp();
        }
        lineTool.activate();
        lastTool=lineTool;
    }
    document.getElementById("EllipseTool").onclick=function(){
        drawLayoutFlag=false;
        if(lastTool!=null){
            lastTool.hangUp();
        }
        ellipseTool.activate();
        lastTool=ellipseTool;
    }

    //html的按钮绑定布局绘画工具的创建函数
    document.getElementById("CurveLayoutTool").onclick=function(){
        drawLayoutFlag=true;
        layoutTool=new CurveTool("showPanel",false);
        layoutTool.activate();
        console.log("点击了CurveLayout",layoutTool)
    }
    document.getElementById("CircleLayoutTool").onclick=function(){
        drawLayoutFlag=true;
        layoutTool=new CircleTool("showPanel",false);
        layoutTool.activate();
        console.log("点击了CircleLayout",layoutTool)
    }


    document.getElementById("ShowPanel").onmousedown=function(event){
        if(drawLayoutFlag){
            layer.setLayoutShape(layoutTool.tool.last_shape,layoutTool.tool.last_shape.position,layoutTool.type);//如果drawLayoutFlag为true，则将刚画的图形设置为布局图形
        }else{
            let p=new paper.Point(event.offsetX,event.offsetY);//否则就是选择绘画板中的图形
            layer.selectShape(p);
            console.log(layer)
        }
    }


    document.getElementById("ShowPanel").onmouseup=function(){
        if(drawLayoutFlag){
            layer.updateLayout();//如果drawLayoutFlag为true，则更新布局
        }else{
            //否则判断图形形状，并给出对应的type
            let type:string;
            if(typeof(lastTool.tool.last_shape)!="undefined"){
                if(typeof(lastTool.tool.last_shape.type)=="undefined"){
                    if(typeof(lastTool.tool.last_shape.width)=="undefined"){
                        if(lastTool.tool.last_shape.segments.length>=2){
                            if(lastTool.tool.last_shape.segments.length==2)
                            type="segment";
                            else
                            type="curve";
                            layer.addShape(lastTool.tool.last_shape,type);
                        }
                    }else{
                        if(lastTool.tool.last_shape.width && lastTool.tool.last_shape.height){
                            type="rectangle";
                            layer.addShape(lastTool.tool.last_shape,type);
                        }
                    }
                }else{
                    if(lastTool.tool.last_shape.type=="ellipse" ){
                        type="ellipse";
                        if(lastTool.tool.last_shape.radius.width &&lastTool.tool.last_shape.radius.height){}
                        layer.addShape(lastTool.tool.last_shape,type);
                    }else if(lastTool.tool.last_shape.type=="circle"){
                        type="circle";
                        if(lastTool.tool.last_shape.radius!=0){
                            layer.addShape(lastTool.tool.last_shape,type)
                        }
                        
                    }
                }
            }
        }
    }
}

