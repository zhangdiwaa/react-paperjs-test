import * as paper from "paper"
import EventHub from "../Common/Observer";

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
 * name ToolFreePen
 * desc 画笔
 */
const ToolFreePen = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.minDistance = 10;

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
            point: event.downPoint,
            content: 'wawa',
            fillColor: 'black',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 25,
            name: 'Text'
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
    //清除所有的group，这个可以放在订阅发布者模式中
    paper.project.getItems({
        class:paper.Group,
        match:function(item){
            if(item.className=="Layer")
            return false;
            else
            return true;
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
const ToolEditPath = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool();
    let project: paper.Project = paper.project;//这个是paper目前活跃的project，可以根据需求改成别的项目
    var selectedShape: any = [];
    let group:paper.Group=null;
    let myCanvas:HTMLElement=document.getElementById("myCanvas");
    let lockState:Boolean=false;
    let isShiftDown:Boolean=false;

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
        drag:true,
        up:true
    })
}
const selectOnMouseUp=(event:paper.ToolEvent,project:paper.Project)=>{
    let items=[]
    let group=null
    let selectedShape=null
    if(event.downPoint.equals(event.point)){
        selectedShape=project.getItems({//获取与点交叠的图形
            overlapping:new paper.Point(event.point),
            class:paper.Path
        })
    }else{
        selectedShape=project.getItems({//获取与矩形框交叠的图形
            inside:new paper.Rectangle({
                from:event.downPoint,
                to:event.point,
            }),
            class:paper.Path
        })
    }
    if(selectedShape){//将每个选中的图元复制一份，组成一个group，然后设置成只显示group的图元
        selectedShape.forEach(element => {
            items.push(element.clone())
            element.visible=false
        });
        group=new paper.Group(items)
        group.bounds.selected=true
    }
    //返回    selectedShape：原本    group：副本
    return [selectedShape,group]
}
//选择的三个函数
const editOnMouseDown=()=>{

}
const editOnMouseDrag=(event:paper.ToolEvent,group:paper.Group,isShiftDown:Boolean)=>{
    let a:paper.Point = event.point.subtract(group.bounds.center)
    let b:paper.Point = group.bounds.bottomLeft.subtract(group.bounds.center)
    let factor:any=null
    if(!isShiftDown){
        factor=new paper.Point(1,1).multiply(a.x/b.x)
    }else{
        factor=a.divide(b).abs()
    }
    group.scale(factor)
}
const editOnMouseUp=(group:paper.Group,selectedShape:paper.Item[])=>{
    for(let i=0;i<selectedShape.length;i++){//将group中的更改应用到selectedShape中
        selectedShape[i].copyContent(group.children[i])
    }
}
//旋转的三个函数
const rotateOnMouseDown=()=>{

}
const rotateOnMouseDrag=(event:paper.ToolEvent,group:paper.Group)=>{
    let angle=-event.point.subtract(group.bounds.center).getDirectedAngle(event.lastPoint.subtract(group.bounds.center))
    group.rotate(angle, group.bounds.center)
}
const rotateOnMouseUp=(group:paper.Group,selectedShape:paper.Item[])=>{
    for(let i=0;i<selectedShape.length;i++){//将group中的更改应用到selectedShape中
        selectedShape[i].copyContent(group.children[i])
    }
}
//移动的三个函数
const moveOnMouseDown=()=>{

}
const moveOnMouseDrag=(event:paper.ToolEvent,group:paper.Group)=>{
    group.translate(event.delta)
}
const moveOnMouseUp=(group:paper.Group,selectedShape:paper.Item[])=>{
    for(let i=0;i<selectedShape.length;i++){//将group中的更改应用到selectedShape中
        selectedShape[i].copyContent(group.children[i])
    }
}
