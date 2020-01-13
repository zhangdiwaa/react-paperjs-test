import { RectTool,CircleTool, CurveTool, LineTool, EllipseTool } from "./app/Tool/tool";
import * as Layer from "./app/Layer/layer";
import * as paper from "paper";
import * as CoordinateSystem from "./app/CoordinateSystem/CoordinateSystem";
import { Point, Circle } from "./app/Element/element";
import { Tool } from "./app/Tool";
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
    circleTool=new CircleTool("ShowPanel",true);
    rectTool=new RectTool("ShowPanel",true);
    curveTool=new CurveTool("ShowPanel",true);
    layoutTool=lastTool=lineTool=new LineTool("ShowPanel",true);
    ellipseTool=new EllipseTool("ShowPanel",true);
    drawLayoutFlag=false;
    layer=new Layer.Layer();

    rectTool.hangUp();
    circleTool.hangUp();
    curveTool.hangUp();
    lineTool.hangUp();
    ellipseTool.hangUp();
    document.getElementById("RectTool").onclick=function(){
        drawLayoutFlag=false;
        if(lastTool!=null){
            lastTool.hangUp();
        }
        rectTool.activate();
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
    document.getElementById("ShowPanel").onmouseup=function(){
        if(drawLayoutFlag){
            layer.updateLayout();
        }else{
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
    document.getElementById("ShowPanel").onmousedown=function(event){
        if(drawLayoutFlag){
            layer.setLayoutShape(layoutTool.tool.last_shape,layoutTool.tool.last_shape.position,layoutTool.type);
        }else{
            let p=new paper.Point(event.offsetX,event.offsetY);
            layer.selectShape(p);
            console.log(layer)
        }
    }
}

