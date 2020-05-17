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
const getColor=()=>{
    let t=document.getElementById('buttonColor')
    //console.log(t)
    return t.style.background
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
    //记录鼠标按下时的canvas
    let nowCanvas: string;
    tool.onMouseDrag = (event: any) => {
        if (nowCanvas === 'canvasOverview') {
            return;
        }
        let path: paper.Path.Circle = new paper.Path.Circle({
            center: event.downPoint,
            radius: event.downPoint.subtract(event.point).length,
            strokeColor: getColor(),
            name: 'Circle'
        })
        path.removeOnDrag()
    }
    tool.onMouseDown = (event: any) => {
        //页面发生改变之前
        pageChange.pageChangeBefore()
        nowCanvas = event.event.target.id
    }
    tool.onMouseUp = () => {
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
            strokeColor: getColor(),
            name: 'Rectangle'
        })
        path.removeOnDrag()
    }
    tool.onMouseDown = () => {
        pageChange.pageChangeBefore()
    }
    tool.onMouseUp = () => {
        pageChange.pageChangeAfter()
    }
}
/**
 * 贝塞尔曲线
 */
const BezierTool = () => {
    RemoveTool()
    let path: paper.Path;
    let tool: paper.Tool = new paper.Tool()
    let types = ['point', 'handleIn', 'handleOut'];

    function findHandle(point) {
        let i = 0, l = path.segments.length;
        //console.log("l:", l);
        for (; i < l; i++) {
            for (let j = 0; j < 3; j++) {
                let type = types[j];
                let segment = path.segments[i];
                let segmentPoint = type === 'point'
                    ? segment.point
                    : segment.point + segment[type];
                //console.log(segmentPoint)
                let distance = point.subtract(segmentPoint).length;
                //console.log(distance)
                if (distance < 5) {
                    return {
                        type: type,
                        segment: segment
                    };
                }
            }
        }
        return null;
    }

    let currentSegment, mode, type;
    tool.onMouseDown = (event) => {
        if (currentSegment)
            currentSegment.selected = false;
        mode = type = currentSegment = null;

        if (!path) {
            path = new paper.Path({
                fillColor: {
                    hue: 360 * Math.random(),
                    saturation: 1,
                    brightness: 1,
                    alpha: 0.5
                }
            });
        }

        const result = findHandle(event.point);
        //console.log("result:",result)
        if (result) {
            currentSegment = result.segment;
            type = result.type;
            if (path.segments.length > 1 && result.type === 'point'
                && result.segment.index === 0) {
                mode = 'close';
                path.closed = true;
                path.selected = false;
                path = null;
            }
        }

        if (mode !== 'close') {
            mode = currentSegment ? 'move' : 'add';
            if (!currentSegment)
                currentSegment = path.add(event.point);
            currentSegment.selected = true;
        }
    }

    tool.onMouseDrag = (event) => {
        //console.log(currentSegment)
        if (mode === 'move' && type === 'point') {
            currentSegment.point = event.point;
        } else if (mode !== 'close') {
            let delta = event.delta.clone();
            let delta2 = delta.clone();
            if (type === 'handleOut' || mode === 'add')
                delta = delta.subtract(delta2).subtract(delta2);
            currentSegment.handleIn = currentSegment.handleIn.add(delta);
            currentSegment.handleOut = currentSegment.handleOut.subtract(delta);
            //console.log("delta2:",delta);
        }
    }
}
/**
 * 画云
 */
const Clouds = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool();
    // Any newly created item will inherit the following styles:
    let path;
    // The user has to drag the mouse at least 30pt before the mouse drag
    // event is fired:
    paper.tool.minDistance = 30;
    tool.onMouseDown = (event) => {
        path = new paper.Path({
            strokeColor: getColor(),
            strokeWidth: 5,
            strokeJoin: 'round',
            strokeCap: 'round'
        })
        path.add(event.point);
    }
    tool.onMouseDrag = (event) => {
        path.arcTo(event.point, true);
    }
}
/**
 * 五条线的画笔
 * @constructor
 */
const MultiLines=()=>{
    RemoveTool()
    let tool=new paper.Tool()
    tool.fixedDistance = 30;

    let values = {
        lines: 5,
        size: 40,
        smooth: true
    };

    let paths;

    tool.onMouseDown=(event)=> {
        paths = [];
        for (let i = 0; i < values.lines; i++) {
            let path = new paper.Path({
                strokeColor:getColor()
            })
            paths.push(path);
        }
    }

    tool.onMouseDrag=(event)=> {
        let offset = event.delta;
        offset.angle = offset.angle + 90;
        let lineSize = values.size / values.lines;
        for (let i = 0; i < values.lines; i++) {
            let path = paths[values.lines - 1 - i];
            offset.length = lineSize * i + lineSize / 2;
            path.add(event.middlePoint.add(offset));
            path.smooth();
        }
    }
}
/**
 * 滴水刷
 * @constructor
 */
const DrippingBrush = () => {
    RemoveTool()
    let path: paper.Path;
    let minSize = 5;
    let tool = new paper.Tool();
    tool.maxDistance = 20;
    tool.onMouseDrag = (event) => {
        // If the user dragged more then minSize:
        if (event.delta.length > minSize) {
            // If there is no path, make one:
            if (!path) {
                path = new paper.Path({
                    fillColor: getColor()
                });
                path.add(event.lastPoint);
            }
            let step = event.delta.divide(2);
            step.angle = step.angle + 90;
            // The top point: the middle point + the step rotated by 90 degrees
            let top = event.middlePoint.add(step);
            // The bottom point: the middle point - the step rotated by 90 degrees:
            let bottom = event.middlePoint.subtract(step);
            path.add(top);
            path.insert(0, bottom);
            path.smooth();
        } else {
            // If the user dragged too slowly:
            // If there is currently a path, close it
            if (path) {
                path.add(event.point);
                path.closed = true;
                path.smooth();
                // Set path to null (nothing) so the path check above
                // will force a new path next time the user drags fast enough:
                path = null;
            }
        }
    }

    tool.onMouseUp = (event) => {
        if (path) {
            path.add(event.point);
            path.closed = true;
            path.smooth();
            // Set path to null (nothing) so the path check above
            // will force a new path next time the user drags fast enough:
            path = null;
        }
    }
}
/**
 * name ToolFreePen
 * desc 自由画笔
 */
const ToolFreePen = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.minDistance = 10;

    let path: paper.Path;
    //每当鼠标按下就新建一条路径
    tool.onMouseDown = () => {
        pageChange.pageChangeBefore()
        path = new paper.Path({
            strokeColor: getColor(),
            name: 'Path'
        })
    }
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        path.add(event.point)
    }
    tool.onMouseUp = () => {
        //path.smooth()
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
            strokeColor: getColor(),
            name: 'Segment'
        })
        path.add(event.downPoint, event.point);
        path.removeOnDrag()
    }
    tool.onMouseDown = () => {
        pageChange.pageChangeBefore()
    }
    tool.onMouseUp = () => {
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
    paper.project.getItems({
        match: function (item) {
            if (item.className === "Group")
                return true;
            else if (item.className === "Path") {
                item.visible = true
            }
            return false;
        }
    }).forEach(element => {
        element.remove()
    })
}

export {
    ToolMove,
    ToolDrawCircle,
    ToolDrawRect,
    ToolFreePen,
    ToolDrawSegment,
    ToolEditPath,
    ToolEnlarge,
    BezierTool,
    ToolShrink,
    Clouds,
    MultiLines,
    DrippingBrush,
    ToolZoomauto,
    ToolZoomin,
    ToolZoomout,
    RemoveTool
}


/**
 * name ToolSelectPath
 * desc 选中路径并编辑
 */
//工具类的辅助函数

//将group中的更改应用到selectedShape中
const applyChange = (group: paper.Group, selectedShape: paper.Item[]) => {
    for (let i = 0; i < selectedShape.length; i++) {
        selectedShape[i].copyContent(group.children[i])
        selectedShape[i].copyAttributes(group.children[i], false)
        selectedShape[i].selected = false
    }
}
//将传进来的item[]复制一份，组成一个group;并将 原本 设置成不可见
const groupItem = (selectedShape: paper.Item[]) => {
    let group: paper.Group = null
    let items = []
    if (selectedShape) {
        selectedShape.forEach(element => {
            items.push(element.clone())
            element.visible = false
        })
        console.log(items)
        group = new paper.Group(items)
        group.bounds.selected = true
        group.selected = true
    }
    return group
}

//选择的三个函数分别对应Down，Drag，Up

const selectOnMouseDown = (group: paper.Group, selectedShape: any) => {
    if (group) {//在每个选择开始阶段，都将上一个选择框创建的group删除
        group.remove()
        selectedShape.forEach(element => {//并将selectedShape的每个图元设置为可见
            element.visible = true
        });
    }
}
const selectOnMouseDrag = (event: paper.ToolEvent) => {
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
const selectOnMouseUp = (event: paper.ToolEvent, project: paper.Project) => {
    let group: paper.Group
    let selectedShape
    if (event.downPoint.equals(event.point)) {
        selectedShape = project.getItems({//获取与点交叠的图形
            overlapping: new paper.Point(event.point),
            match: function (item) {
                return item.className === 'PointText' || item.className === 'Path';
            }
        })
        selectedShape = selectedShape.length !== 0 ? [selectedShape[0]] : selectedShape;//只选择一个
    } else {
        selectedShape = project.getItems({//获取与矩形框交叠的图形
            inside: new paper.Rectangle({
                from: event.downPoint,
                to: event.point,
            }),
            match: function (item) {
                return item.className === 'PointText' || item.className === 'Path';
            }
        })
    }
    group = groupItem(selectedShape)
    //返回    selectedShape：原本    group：副本
    return [selectedShape, group]
}
//选择的三个函数
const editOnMouseDown = () => {

}
const editOnMouseDrag = (event: paper.ToolEvent, group: paper.Group, isShiftDown: Boolean) => {
    let a: paper.Point = event.point.subtract(group.bounds.center)//变化的长度
    let b: paper.Point = group.bounds.bottomLeft.subtract(group.bounds.center)//原来图形的长度
    let factor: any //比例因子
    if (!isShiftDown) {
        factor = new paper.Point(1, 1).multiply(a.x / b.x).abs()//没有按下shift，则按原来比例缩放
    } else {
        factor = a.divide(b).abs()//按下shift，则不按原来比例缩放
    }
    group.scale(factor)
}
const editOnMouseUp = (group: paper.Group, selectedShape: paper.Item[]) => {
    applyChange(group, selectedShape)
}
//旋转的三个函数
const rotateOnMouseDown = () => {

}
const rotateOnMouseDrag = (event: paper.ToolEvent, group: paper.Group) => {
    let angle = -event.point.subtract(group.bounds.center).getDirectedAngle(event.lastPoint.subtract(group.bounds.center))
    group.rotate(angle, group.bounds.center)
}
const rotateOnMouseUp = (group: paper.Group, selectedShape: paper.Item[]) => {
    applyChange(group, selectedShape)
}
//移动的三个函数
const moveOnMouseDown = () => {

}
const moveOnMouseDrag = (event: paper.ToolEvent, group: paper.Group) => {
    group.translate(event.delta)
}
const moveOnMouseUp = (group: paper.Group, selectedShape: paper.Item[]) => {
    applyChange(group, selectedShape)
}

//工具类(不能用lamba表达式,我需要访问arguments)
function ToolEditPath(scope: any) {//这个scope相当于this
    RemoveTool()
    let tool: paper.Tool = new paper.Tool();//当前工具
    let project: paper.Project = paper.project;//这个是paper目前活跃的project，可以根据需求改成别的项目
    var selectedShape: any = scope.hasOwnProperty('length') ? scope : []//被选中的图元,看情况初始化成[]或paper.item[]
    let group: paper.Group = groupItem(selectedShape);//被选中的图形
    let myCanvas: HTMLElement = document.getElementById("myCanvas");
    let lockState: Boolean = false;
    let isShiftDown: Boolean = false;
    //全选
    document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey) {
            if (e.code === "KeyA") {
                selectedShape = null
                selectedShape = project.getItems({
                    class: paper.Path
                })
                group = groupItem(selectedShape)
            }
        }
    })
    tool.onKeyDown = (event: paper.KeyEvent) => {
        //判断shift是否按下
        if (event.key === "shift") {
            isShiftDown = true
        }
        //判断delete是否按下
        if (event.key === "delete") {
            pageChange.pageChangeBefore()
            paper.project.getItems({
                class: paper.Group,
                match: function (item) {
                    //console.log("item: ")
                    //console.log(item)
                    if (item.className === "Group")
                        return true
                }
            }).forEach(element => {
                //console.log("element； "+element)
                element.remove()
            })
            selectedShape.forEach(element => {
                element.remove()
            });
            pageChange.pageChangeAfter()
        }
    }
    tool.onKeyUp = (event: paper.KeyEvent) => {//判断shift是否松开
        if (event.key === "shift") {
            isShiftDown = false
        }
    }
    //onMouseMove是为了检测目前鼠标的位置，进而改变当前可做的动作和鼠标样式
    tool.onMouseMove = (event: paper.ToolEvent) => {
        if (!lockState && group) {
            let isEdit, isRotate, isMove;//判断当前的状态
            isEdit = !!group.hitTest(event.point, {//如果在边角就是可以编辑
                bounds: true
            })
            isRotate = !!group.hitTest(event.point, {//如果在范围较大的边角就是可以旋转
                bounds: true,
                tolerance: 16
            })
            isMove = group.bounds.contains(event.point)
            if (isEdit) {//编辑的优先级最高
                myCanvas.className = "edit"
            } else if (isMove) {//然后移动
                myCanvas.className = "move"
            } else if (isRotate) {
                myCanvas.className = "rotate"
            } else {
                myCanvas.className = "none"
            }
        }
    }
    //以下三个事件函数触发动作
    tool.onMouseDown = () => {
        pageChange.pageChangeBefore()
        lockState = true
        switch (myCanvas.className) {
            case 'edit':
                editOnMouseDown();
                break;
            case 'rotate':
                rotateOnMouseDown();
                break;
            case 'move':
                moveOnMouseDown();
                break;
            default:
                selectOnMouseDown(group, selectedShape);
                break;
        }
    }
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        switch (myCanvas.className) {
            case 'edit':
                editOnMouseDrag(event, group, isShiftDown);
                break;
            case 'rotate':
                rotateOnMouseDrag(event, group);
                break;
            case 'move':
                moveOnMouseDrag(event, group);
                break;
            default:
                selectOnMouseDrag(event);
                break;
        }
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
        lockState = false
        switch (myCanvas.className) {
            case 'edit':
                editOnMouseUp(group, selectedShape);
                break;
            case 'rotate':
                rotateOnMouseUp(group, selectedShape);
                break;
            case 'move':
                moveOnMouseUp(group, selectedShape);
                break;
            default:
                [selectedShape, group] = selectOnMouseUp(event, project);
                break;//我选择用返回值来修改selectedShape
        }
        pageChange.pageChangeAfter()
    }
}
