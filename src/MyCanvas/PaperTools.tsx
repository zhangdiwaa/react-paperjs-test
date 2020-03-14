import * as paper from "paper"
import EventHub from "../Common/Observer";

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
            strokeColor: "black"
        })
        path.removeOnDrag()
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
            strokeColor: "black"
        })
        path.removeOnDrag()
    }
    tool.onMouseDown = (event: paper.ToolEvent) => {
        //Test-切换工具的时候保存canvas
        EventHub.emit('mouseDownBefore', null)
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

    let path: paper.Path = new paper.Path({
        strokeColor: "black"
    })
    //每当鼠标按下就新建一条路径
    tool.onMouseDown = (event: paper.ToolEvent) => {
        path = new paper.Path({
            strokeColor: "black"
        })
    }
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        path.add(event.point)
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
            strokeColor: "black"
        })
        path.add(event.downPoint, event.point);
        path.removeOnDrag()
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
        let text: paper.PointText = new paper.PointText({
            point: event.downPoint,
            content: 'wawa',
            fillColor: 'black',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
            fontSize: 25
        });
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
    let myCanvas:HTMLElement=document.getElementById("myCanvas");
    let editShape:any =null;
    let moveShape:any =null;
    let rotateShape:any=null;
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
        if(!lockState){
            editShape=project.hitTest(event.point,{
                bounds:true,
                selected:true
            })
            rotateShape=project.hitTest(event.point,{
                bounds:true,
                selected:true,
                tolerance:16
            })
            selectedShape.forEach(element => {
                if(element.contains(event.point)){
                    moveShape=element
                    return;
                }else{
                    moveShape=null
                }
            });
            if(editShape){
                myCanvas.className="edit"
            }else if(rotateShape){
                myCanvas.className="rotate"
            }else if(moveShape){
                myCanvas.className="move"
            }else{
                myCanvas.className="none"
            }
        }
    }
    //以下三个事件函数触发动作
    tool.onMouseDown=(event:paper.ToolEvent)=>{
        lockState=true
        switch(myCanvas.className){
            case 'edit': edit1();break;
            case 'rotate': rotate1();break;
            case 'move': move1();break;
            default: select1(selectedShape);break;
        }
    }
    tool.onMouseDrag=(event:paper.ToolEvent)=>{
        switch(myCanvas.className){
            case 'edit': edit2(event,editShape.item,isShiftDown);break;
            case 'rotate': rotate2(event,rotateShape.item);break;
            case 'move': move2(event,moveShape);break;
            default: select2(event);break;
        }
    }
    tool.onMouseUp=(event:paper.ToolEvent)=>{
        lockState=false
        switch(myCanvas.className){
            case 'edit': edit3();break;
            case 'rotate': rotate3();break;
            case 'move': move3();break;
            default: selectedShape=select3(event,project);break;//我选择用返回值来修改selectedShape
        }
    }
}
//选择的三个函数分别对应Down，Drag，Up
const select1=(selectedShape)=>{
    //将上次选择的所有图形设置为不选择
    if(selectedShape){
        selectedShape.forEach(element => {
            element.selected=false
            element.bounds.selected=false
        });
    }
}
const select2=(event:paper.ToolEvent)=>{
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
const select3=(event:paper.ToolEvent,project:paper.Project)=>{
    let selectedShape=project.getItems({//获取与矩形框交叠的图形
        inside:new paper.Rectangle({
            from:event.downPoint,
            to:event.point
        })
    })
    if(selectedShape){
        selectedShape.forEach(element => {
            //必须判断是否是Layer，否则设置Layer的selected为true，其内的所有图形selected都变成true
            if(element.className!="Layer"){
                element.selected=true
                element.bounds.selected=true
            }
        });
    }
    return selectedShape
}
//选择的三个函数
const edit1=()=>{

}
const edit2=(event:paper.ToolEvent,editShape:paper.Path,isShiftDown:Boolean)=>{
    let a:paper.Point = event.point.subtract(editShape.bounds.center)
    let b:paper.Point = editShape.bounds.bottomLeft.subtract(editShape.bounds.center)
    let factor:any=null
    if(!isShiftDown){
        factor=new paper.Point(1,1).multiply(a.x/b.x)
    }else{
        factor=a.divide(b).abs()
    }
    editShape.scale(factor)
}
const edit3=()=>{

}
//旋转的三个函数
const rotate1=()=>{

}
const rotate2=(event:paper.ToolEvent,rotateShape:paper.Path)=>{
    let angle=-event.point.subtract(rotateShape.bounds.center).getDirectedAngle(event.lastPoint.subtract(rotateShape.bounds.center))
    rotateShape.rotate(angle, rotateShape.bounds.center)
}
const rotate3=()=>{

}
//移动的三个函数
const move1=()=>{

}
const move2=(event:paper.ToolEvent,moveShape:paper.Path)=>{
    moveShape.translate(event.delta)
}
const move3=()=>{

}
