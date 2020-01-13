import * as paper from "paper";

//直线选择算法不准确
function selectLine(item:any,p:paper.Point){
    let X1=Math.abs(item.segments[0].point.x-item.segments[1].point.x);
    let Y1=Math.abs(item.segments[0].point.y-item.segments[1].point.y);
    let X2=Math.abs(item.segments[0].point.x-p.x);
    let Y2=Math.abs(item.segments[0].point.y-p.y);
    let value1=Math.round(X1/Y1);  
    let value2=Math.round(X2/Y2);
    if(value1==value2){
        item.selected=true;
    }else{
        item.selected=false;
    }
}

export class Layer{
    circleArray:any[];
    curveArray:any[];
    ellipseArray:any[];
    rectangleArray:any[];
    segmentArray:any[];
    position:paper.Point;
    length:number;
    layoutShape:any;
    layoutToolType:string;
    constructor(){
        this.length=0;
        this.circleArray=new Array();
        this.curveArray=new Array();
        this.ellipseArray=new Array();
        this.rectangleArray=new Array();
        this.segmentArray=new Array();
        this.position=new paper.Point(paper.view.element.clientWidth/2,paper.view.element.clientHeight/2)
    }
    addShape(shape:any,type:string){
        if(type=="circle"){
            this.circleArray.push(shape);
        }else if(type=="curve"){
            this.curveArray.push(shape);
        }else if(type=="ellipse"){
            this.ellipseArray.push(shape);
        }else if(type=="rectangle"){
            this.rectangleArray.push(shape);
        }else if(type=="segment"){
            this.segmentArray.push(shape);
        }
        this.length++;
    }
    removeShape(id:number,type:string){
        
    }
    selectShape(point:paper.Point){
        this.circleArray.forEach((item,i,array)=>{
            if(item.contains(point)){
                item.selected=true;
            }else{
                item.selected=false;
            }
        })
        this.curveArray.forEach((item,i,array)=>{
            if(item.contains(point)){
                item.selected=true;
            }else{
                item.selected=false;
            }
        })
        this.ellipseArray.forEach((item,i,array)=>{
            if(item.contains(point)){
                item.selected=true;
            }else{
                item.selected=false;
            }
        })
        this.rectangleArray.forEach((item,i,array)=>{
            if(item.contains(point)){
                item.selected=true;
            }else{
                item.selected=false;
            }
        })
        this.segmentArray.forEach((item,i,array)=>{
            selectLine(item,point);
        })
    }
    setLayoutShape(shape:any,point:paper.Point,type:string){
        this.layoutShape=shape;
        this.layoutToolType=type;
        this.position=point;
    }
    updateLayout(){
        if(this.layoutToolType=="CurveTool"){
            let distance:number=Math.round(this.layoutShape.segments.length/(this.length+1));
            let index:number=0;
            this.circleArray.forEach((item,i,array)=>{
                item.position=this.layoutShape.segments[(index++)*distance].point;
            })
            this.curveArray.forEach((item,i,array)=>{
                item.position=this.layoutShape.segments[(index++)*distance].point;
            })
            this.ellipseArray.forEach((item,i,array)=>{
                item.position=this.layoutShape.segments[(index++)*distance].point;
            })
            this.rectangleArray.forEach((item,i,array)=>{
                item.position=this.layoutShape.segments[(index++)*distance].point;
            })
            this.segmentArray.forEach((item,i,array)=>{
                item.position=this.layoutShape.segments[(index++)*distance].point;
            })
        }else if(this.layoutToolType=="CircleTool"){
            let radian:number=Math.round(360/this.length)/360*2*Math.PI;//弧度
            let index:number=0;
            let radius=this.layoutShape.radius;
            this.circleArray.forEach((item,i,array)=>{
                let distance=[Math.cos(radian*index),Math.sin(radian*index)];
                item.position=this.position.add((new paper.Point(distance)).multiply(radius));
                index++;
            })
            this.curveArray.forEach((item,i,array)=>{
                let distance=[Math.cos(radian*index),Math.sin(radian*index)];
                item.position=this.position.add((new paper.Point(distance)).multiply(radius));
                index++;
            })
            this.ellipseArray.forEach((item,i,array)=>{
                let distance=[Math.cos(radian*index),Math.sin(radian*index)];
                item.position=this.position.add((new paper.Point(distance)).multiply(radius));
                index++;
            })
            this.rectangleArray.forEach((item,i,array)=>{
                let distance=[Math.cos(radian*index),Math.sin(radian*index)];
                item.position=this.position.add((new paper.Point(distance)).multiply(radius));
                index++;
            })
            this.segmentArray.forEach((item,i,array)=>{
                let distance=[Math.cos(radian*index),Math.sin(radian*index)];
                item.position=this.position.add((new paper.Point(distance)).multiply(radius));
                index++;
            })
        }
    }
}