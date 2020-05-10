import * as paper from "paper"
import EventHub from "../Common/Observer";
import { useEffect } from "react";
import { type } from "os";

const pageChange = {
    pageChangeBefore: () => {
        EventHub.emit('pageChangeBefore', null)
    },
    pageChangeAfter: () => {
        EventHub.emit('pageChangeAfter', null)
    }
}


/**
 * name ToolMove
 * desc 拖拽画布
 */
const ToolMove = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    let view: paper.View = paper.view;
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        view.translate(event.point.subtract(event.downPoint))
    }
}
/**
 * name ToolDrawCircle
 * desc 画圆
 */
const ToolDrawCircle = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        let path: paper.Path.Circle = new paper.Path.Circle({
            center: event.downPoint,
            radius: event.downPoint.subtract(event.point).length,
            strokeColor: "black",
            name: 'Circle'
        })
        path.removeOnDrag()
    }
    tool.onMouseDown = (event: paper.ToolEvent) => {
        //页面发生改变之前
        pageChange.pageChangeBefore()
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
        //页面发生改变之后
        pageChange.pageChangeAfter()
    }
}
/**
 * name ToolDrawRect
 * desc 画方
 */
const ToolDrawRect = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        let path: paper.Path.Rectangle = new paper.Path.Rectangle({
            from: event.downPoint,
            to: event.point,
            strokeColor: "black",
            name: 'Rectangle'
        })
        path.removeOnDrag()
    }
    tool.onMouseDown = (event: paper.ToolEvent) => {
        pageChange.pageChangeBefore()
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
        pageChange.pageChangeAfter()
    }
}

/**
 * name ToolDrawSegment
 * desc 画线段
 */
const ToolDrawSegment = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        let path: paper.Path = new paper.Path({
            strokeColor: "black",
            name: 'Segment'
        })
        path.add(event.downPoint, event.point);
        path.removeOnDrag()
    }
    tool.onMouseDown = (event: paper.ToolEvent) => {
        pageChange.pageChangeBefore()
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
        pageChange.pageChangeAfter()
    }
}
/**
 * name ToolPointText
 * desc 写字
 */
const ToolPointText = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.onMouseDown = (event: paper.ToolEvent) => {
        pageChange.pageChangeBefore()
        let text: paper.PointText = new paper.PointText({
            content: 'wawa',
            fillColor: 'black',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 25,
            name: 'Text',
            position:event.downPoint
        });
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
        pageChange.pageChangeAfter()
    }

}

/**
 * name ToolEnlarge
 * desc 点击放大
 */
const ToolEnlarge = () => {
    RemoveTool();
    let tool: paper.Tool = new paper.Tool();
    tool.onMouseDown = (event: paper.ToolEvent) => {
        let view: paper.View = paper.view;
        view.scale(1.5, event.point);//1.5是放大比例系数，后面的event.point是放大的中心点
    }
}

//点击缩小
const ToolShrink = () => {
    RemoveTool();
    let tool: paper.Tool = new paper.Tool();
    tool.onMouseDown = (event: paper.ToolEvent) => {
        let view: paper.View = paper.view;
        view.scale(0.5, event.point);//0.75是放大比例系数，后面的event.point是放大的中心点
    }
}

//zoom to fit canvas
const ToolZoomauto = () => {
    paper.project.activeLayer.fitBounds(paper.view.bounds);
}

//底角放大
const ToolZoomin = () => {
    paper.view.scale(1.5, 1.5);
}
//底角缩小
const ToolZoomout = () => {
    paper.view.scale(0.5, 0.5);
}


//清除所有工具的辅助函数，每一个工具函数使用前都要先执行
const RemoveTool = () => {
    //先清除所有的工具
    paper.tools.forEach((item) => {
        item.remove()
    })
    //清除暂时的group，并将不可见的图形设置为可见
    let group=paper.project.getItems({
        match:function(item){
            if(item.className=="Group")
            return true;
            else if(item.className=="Path" || item.className=="PointText"){
                item.visible=true
            }
            return false;
        }
    }).forEach(element=>{
        element.remove()
    })
}

export {
    ToolMove,
    ToolDrawCircle,
    ToolDrawRect,
    ToolFreePen,
    ToolDrawSegment,
    ToolPointText,
    ToolEditPath,
    ToolEnlarge,
    ToolShrink,
    ToolZoomauto,
    ToolZoomin,
    ToolZoomout
}


/**
 * name ToolSelectPath
 * desc 选中路径并编辑
 */
//工具类的辅助函数

//将group中的更改应用到selectedShape中
const applyChange=(group:paper.Group,selectedShape:paper.Item[])=>{
    for(let i=0;i<selectedShape.length;i++){
        selectedShape[i].copyContent(group.children[i])
        selectedShape[i].copyAttributes(group.children[i],false);
        selectedShape[i].selected=false;
    }
}
//将传进来的item[]复制一份，组成一个group;并将 原本 设置成不可见
const groupItem=(selectedShape:paper.Item[])=>{
    let group:paper.Group=null
    let items=[]
    if(selectedShape){
        selectedShape.forEach(element=>{
            items.push(element.clone())
            element.visible=false
        })
        console.log(items)
        group=new paper.Group(items)
        group.bounds.selected=true
        group.selected=true
    }
    
    return group
}

//选择的三个函数分别对应Down，Drag，Up

const selectOnMouseDown=(group:paper.Group,selectedShape:any)=>{
    if(group){//在每个选择开始阶段，都将上一个选择框创建的group删除
        group.remove()
        selectedShape.forEach(element => {//并将selectedShape的每个图元设置为可见
            element.visible=true
        });
    }
}
const selectOnMouseDrag=(event:paper.ToolEvent)=>{
    //下面这个Rect是虚线样式的选择框
    let Rect: paper.Path.Rectangle = new paper.Path.Rectangle({
        from: event.downPoint,
        to: event.point,
        strokeColor: "black",
        dashArray: [2, 2]
    })
    Rect.removeOn({
        drag: true,
        up: true
    })
}
const selectOnMouseUp=(event:paper.ToolEvent,project:paper.Project)=>{
    let group:paper.Group=null
    let selectedShape=null
    if(event.downPoint.equals(event.point)){
        selectedShape=project.getItems({//获取与点交叠的图形
            overlapping:event.downPoint,
            match:function(item){
                if(item.className=="PointText" || item.className=="Path")
                return true
                else
                return false
            }
        })
        selectedShape=selectedShape.length!=0?[selectedShape[0]]:selectedShape;//只选择一个
    }else{
        selectedShape=project.getItems({//获取与矩形框交叠的图形
            inside:new paper.Rectangle({
                from:event.downPoint,
                to:event.point,
            }),
            match:function(item){
                if(item.className=="PointText" || item.className=="Path")
                return true
                else
                return false
            }
        })
    }
    group=groupItem(selectedShape)
    //返回    selectedShape：原本    group：副本
    return [selectedShape,group]
}
//编辑的三个函数
const editOnMouseDown=()=>{

}
const editOnMouseDrag=(event:paper.ToolEvent,group:paper.Group,isShiftDown:Boolean)=>{
    let a:paper.Point = event.point.subtract(group.bounds.center)//变化的长度
    let b:paper.Point = group.bounds.bottomLeft.subtract(group.bounds.center)//原来图形的长度
    let factor:any=null//比例因子
    if(!isShiftDown){
        factor=new paper.Point(1,1).multiply(a.x/b.x).abs()//没有按下shift，则按原来比例缩放
    }else{
        factor=a.divide(b).abs()//按下shift，则不按原来比例缩放
    }
    group.scale(factor)
}
const editOnMouseUp=(group:paper.Group,selectedShape:paper.Item[])=>{
    applyChange(group,selectedShape)
}
//旋转的三个函数
const rotateOnMouseDown=()=>{

}
const rotateOnMouseDrag=(event:paper.ToolEvent,group:paper.Group)=>{
    let angle=-event.point.subtract(group.bounds.center).getDirectedAngle(event.lastPoint.subtract(group.bounds.center))
    group.rotate(angle, group.bounds.center)
}
const rotateOnMouseUp=(group:paper.Group,selectedShape:paper.Item[])=>{
    applyChange(group,selectedShape)
}
//移动的三个函数
const moveOnMouseDown=()=>{

}
const moveOnMouseDrag=(event:paper.ToolEvent,group:paper.Group)=>{
    group.translate(event.delta)
}
const moveOnMouseUp=(group:paper.Group,selectedShape:paper.Item[])=>{
    applyChange(group,selectedShape)
}

//工具类(不能用lamba表达式,我需要访问arguments)
function ToolEditPath(scope:any){//这个scope相当于this
    RemoveTool()
    let tool: paper.Tool = new paper.Tool();//当前工具
    let project: paper.Project = paper.project;//这个是paper目前活跃的project，可以根据需求改成别的项目
    var selectedShape: any = scope.hasOwnProperty('length')?scope:[]//被选中的图元,看情况初始化成[]或paper.item[]
    let group:paper.Group=groupItem(selectedShape);//被选中的图形
    let myCanvas:HTMLElement=document.getElementById("myCanvas");
    let lockState:Boolean=false;
    let isShiftDown:Boolean=false;
    //判断shift是否按下
    tool.onKeyDown=(event:paper.KeyEvent)=>{//判断shift是否按下
        if(event.key=="shift"){
            isShiftDown=true
        }
    }
    tool.onKeyUp=(event:paper.KeyEvent)=>{//判断shift是否松开
        if(event.key=="shift"){
            isShiftDown=false
        }
    }
    //onMouseMove是为了检测目前鼠标的位置，进而改变当前可做的动作和鼠标样式
    tool.onMouseMove=(event:paper.ToolEvent)=>{
        if(!lockState && group){
            let isEdit,isRotate,isMove;//判断当前的状态
            isEdit=group.hitTest(event.point,{//如果在边角就是可以编辑
                bounds:true
            })?true:false
            isRotate=group.hitTest(event.point,{//如果在范围较大的边角就是可以旋转
                bounds:true,
                tolerance:16
            })?true:false
            isMove=group.bounds.contains(event.point)?true:false
            if(isEdit){//编辑的优先级最高
                myCanvas.className="edit"
            }else if(isMove){//然后移动
                myCanvas.className="move"
            }else if(isRotate){
                myCanvas.className="rotate"
            }else{
                myCanvas.className="none"
            }
        }
    }
    //以下三个事件函数触发动作
    tool.onMouseDown=(event:paper.ToolEvent)=>{
        lockState=true
        switch(myCanvas.className){
            case 'edit': editOnMouseDown();break;
            case 'rotate': rotateOnMouseDown();break;
            case 'move': moveOnMouseDown();break;
            default: selectOnMouseDown(group,selectedShape);break;
        }
    }
    tool.onMouseDrag=(event:paper.ToolEvent)=>{
        switch(myCanvas.className){
            case 'edit': editOnMouseDrag(event,group,isShiftDown);break;
            case 'rotate': rotateOnMouseDrag(event,group);break;
            case 'move': moveOnMouseDrag(event,group);break;
            default: selectOnMouseDrag(event);break;
        }
    }
    tool.onMouseUp=(event:paper.ToolEvent)=>{
        lockState=false
        switch(myCanvas.className){
            case 'edit': editOnMouseUp(group,selectedShape);break;
            case 'rotate': rotateOnMouseUp(group,selectedShape);break;
            case 'move': moveOnMouseUp(group,selectedShape);break;
            default: [selectedShape,group]=selectOnMouseUp(event,project);break;//我选择用返回值来修改selectedShape
        }
    }
}




/**
 * name ToolFreePen
 * desc 画笔
 */
const ToolFreePen = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.minDistance = 3;
    tool.maxDistance = 3;
    let Group:paper.Group=new paper.Group()
    let children=[]
    for(let i=0;i<20;i++){
        children.push(new paper.Path.Rectangle({
            from: new paper.Point(100,100),
            to: new paper.Point(Math.ceil(Math.random()*100)+110,Math.ceil(Math.random()*100+110)),
            strokeColor: "black",
            name: 'Rectangle'
        }))
    }
    for(let i=0;i<20;i++){
        let shape=children[i].toShape()
        let size=shape.size
        shape.remove()
        children[i].data.radius=Math.pow(size.width*size.width+size.height*size.height,0.5)
        children[i].data.offset=Math.random()*200-100
    }
    Group.addChildren(children)
    let path: paper.Path;
    //每当鼠标按下就新建一条路径
    tool.onMouseDown = (event: paper.ToolEvent) => {
        pageChange.pageChangeBefore()
        path = new paper.Path({
            strokeColor: "black",
            name: 'Path'
        })
    }
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        path.add(event.point)
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
        pageChange.pageChangeAfter()
        getProperPath(path,Group)
    }
}

const getProperPath=function(path:paper.Path,group:any)
{
    //获取合适的自由布局
    //定义常量：LARGE为1，表示放大倍数大
    //PROPER为2
    //SMALL为3
    let maxFactor=0
    let minFactor=0
    group.children.forEach((item)=>{
        maxFactor+=item.data.radius*2
    })
    minFactor=maxFactor/path.length*0.65//获取最小的缩放因子，不建议修改
    maxFactor=maxFactor/path.length*1.35//获取最大的缩放因子，不建议修改
    let middle=maxFactor
    console.log(path)
    //获取缩放因子之后，对Path进行点的添加或删除，使其适应缩放大小
    getProperPointNumber(path,middle)
    console.log(path)
    let flag=1
    let lastFlag=1
    let lastMiddle=maxFactor
    while(true){
        flag=freeLayoutCalculation(path.clone().scale(middle),group,false)
        if(2==flag ||lastFlag!=flag)
        break
        console.log(flag,middle)
        lastFlag=flag
        if(flag==1)
        maxFactor=middle
        lastMiddle=middle
        middle=(maxFactor+minFactor)/2
    }
    if(flag==2){
        path.scale((middle+maxFactor)/2)
    }else{
        path.scale((lastMiddle+maxFactor)/2)
    }
    freeLayoutCalculation(path,group,true)
}

const freeLayoutCalculation=function(path:any,group:any,apply:boolean){
    //自由布局计算，假设该算法必定会求出一个布局
    let index=0
    let i
    let lastCircleCenter:paper.Point=getCircleCenter(path.curves[0].point1,path.curves[1].point1,path.curves[1].point2,group.children[0].data.offset)
    if(apply){
        group.children[index].rotate(lastCircleCenter.subtract(path.curves[1].point1).angle,group.children[index].position)
        group.children[index].set({
            position:lastCircleCenter
        })

        let newp=new paper.Path({
            strokeColor: "black",
            name: 'Segment'
        })
        newp.add(lastCircleCenter)
        newp.add(path.curves[1].point1)
        console.log(newp,lastCircleCenter.subtract(path.curves[1].point1).angle)
    }
    index++
    for(i=1;i<path.curves.length-1;i++){
        let circleCenter:paper.Point=getCircleCenter(path.curves[i].point1,path.curves[i+1].point1,path.curves[i+1].point2,group.children[index].data.offset)
        if(lastCircleCenter.getDistance(circleCenter)>=(group.children[index-1].data.radius+group.children[index].data.radius)*0.85){
            if(apply){
                group.children[index].rotate(circleCenter.subtract(path.curves[i+1].point1).angle,group.children[index].position)
                group.children[index].set({
                    position:circleCenter
                })

                let newp=new paper.Path({
                    strokeColor: "black",
                    name: 'Segment'
                })
                newp.add(circleCenter)
                newp.add(path.curves[i+1].point1)
                console.log(newp,circleCenter.subtract(path.curves[i+1].point1).angle)
            }
            index++
            lastCircleCenter=circleCenter
            i+=5 //步数建议在5~10
        }
        if(index>=group.children.length)
        break
    }
    if(!apply){
        if(index<group.children.length){
            path.remove()
            return 3
        }
        else if(path.curves.length-i>=5){
            path.remove()
            return 1
        }
        else{
            path.remove()
            return 2
        }
    }
}

/*
const freeLayoutCalculationInPath=function(path:any,group:any,apply:boolean){
    //自由布局计算，所求圆心在曲线内
    let index=0
    let i
    let lastCircleCenter:paper.Point=path.curves[0].point1
    group.children[index++].set({
        position:lastCircleCenter
    })
    for(i=1;i<path.curves.length-1;i++){
        if(lastCircleCenter.getDistance(path.curves[i].point1)>=(group.children[index].data.radius+group.children[index].data.radius)*0.8){
            apply?group.children[index++].set({
                position:path.curves[i].point1
            }):index++
            // if(isIntersects(group.children[index-1],group,index-1)){
            //     index--
            //     continue
            // }
            lastCircleCenter=path.curves[i].point1
            i+=Math.floor(group.children[index-1].bounds.width/2)
        }
        if(index>=group.children.length)
        break
    }
    if(!apply){
        if(index<group.children.length){
            path.remove()
            return 3
        }
        else if(path.curves.length-i>=5){
            path.remove()
            return 1
        }
        else{
            path.remove()
            return 2
        }
    }
}
*/
const isIntersects=function(item:any,group:paper.Group,index:number){
    for(let i=index;i>=0;i--){
        if(item.intersects(group.children[i]))
        return true
    }
    return false
}

const getProperPointNumber=function(path:any,factor:number){//增删path的点，如果点不够，则添加点
    let scaleTimes:number=Math.floor(Math.log2(factor))
    scaleTimes=scaleTimes>=4?4:scaleTimes //为了性能，限制缩放次数
    if(scaleTimes==0)//如果缩放次数为0，即为不用添加点就可以
    return ;
    let isEnlarge:boolean=scaleTimes>0?true:false
    for(let i=0;i<Math.abs(scaleTimes);i++)
    changePointNumber(path,isEnlarge)
}

const changePointNumber=function(path:any,isEnlarge:boolean){
    let newPath:paper.Path=new paper.Path({
        strokeColor: "black",
        name: 'Path',
    })
    let i
    if(isEnlarge){
        for(i=0;i<path.curves.length;i++){
            newPath.add(path.curves[i].point1)
            newPath.add(path.curves[i].point1.clone().add(path.curves[i].point2).divide(2))
        }
    }else{
        for(i=0;i<path.curves.length;i+=2){
            newPath.add(path.curves[i].point1)
        }
    }
    path.copyContent(newPath)
    path.copyAttributes(newPath)
    newPath.remove()
}

const getCircleCenter=function(point1:paper.Point,point2:paper.Point,point3:paper.Point,radius:number){
    /*求法线点及法线长度*/
    let factor:paper.Point=new paper.Point(point1.y-point3.y,point3.x-point1.x)
    let r=point1.clone().getDistance(point3.clone())
    let circleCenter:paper.Point
    circleCenter=point2.clone().add(factor.clone().multiply(radius).divide(r))
    //console.log(circleCenter.subtract(point2))
    return circleCenter
}


// const getAuxiliaryPoint=function(point1:paper.Point,point2:paper.Point,point3:paper.Point){
//     /**求三点的圆心和半径 */
//     let A=point1.x*(point2.y-point3.y)
//     -point1.y*(point2.x-point3.x)
//     +point2.x*point3.y
//     -point3.x*point2.y;
//     let B=(point1.x*point1.x+point1.y*point1.y)*(point3.y-point2.y)
//     +(point2.x*point2.x+point2.y*point2.y)*(point1.y-point3.y)
//     +(point3.x*point3.x+point3.y*point3.y)*(point2.y-point1.y);
//     let C=(point1.x*point1.x+point1.y*point1.y)*(point2.x-point3.x)
//     +(point2.x*point2.x+point2.y*point2.y)*(point3.x-point1.x)
//     +(point3.x*point3.x+point3.y*point3.y)*(point1.x-point2.x);
//     let D=(point1.x*point1.x+point1.y*point1.y)*(point3.x*point2.y-point3.y*point2.x)
//     +(point2.x*point2.x+point2.y*point2.y)*(point1.x*point3.y-point1.y*point3.x)
//     +(point3.x*point3.x+point3.y*point3.y)*(point2.x*point1.y-point2.y*point1.x);
//     let x=-B/(2*A);
//     let y=-C/(2*A);
//     let temp=(B*B+C*C-4*A*D)/(4*A*A);
//     let r=Math.sqrt(temp);
//     // new paper.Path.Circle({
//     //     center: new paper.Point(x,y),
//     //     radius: r,
//     //     strokeColor: "red",
//     //     name: 'Circle'
//     // })
//     return [new paper.Point(x,y),r]
// }



