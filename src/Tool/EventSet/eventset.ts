import * as paper from "paper"

//以下三个函数是绑定在paper.Tool工具类里的函数
function onMouseUp(event:paper.ToolEvent){
    this.parent.mouseUpEvent=event;
    this.parent.isUp=true;
}
function onMouseDown(event:paper.ToolEvent){
    this.parent.isUp=false;
    this.parent.mouseDownEvent=this.parent.mouseDragEvent=this.parent.mouseMoveEvent=event;
    this['parent']['root']['updateSomething'](this.parent)//只要传入函数名即可调用该函数
}
function onMouseDrag(event:paper.ToolEvent){
    this.parent.mouseDragEvent=event;
}
function onMouseMove(event:paper.ToolEvent){
    this.parent.mouseMoveEvent=event;
}

export default class eventSet{
    mouseDownEvent:paper.ToolEvent;
    mouseUpEvent:paper.ToolEvent;
    mouseDragEvent:paper.ToolEvent;
    mouseMoveEvent:paper.ToolEvent;
    tool:any;//将tool的类型设置成any是为了传入parent属性而不报错
    root:any;
    isUp:boolean;
    constructor(root){
        if(paper.View!=null){
            this.tool=new paper.Tool();
            this.tool.parent=this;//将parent属性传入paper.Tool类中，以便将事件赋值给eventSet中的属性
            this.tool.onMouseUp=onMouseUp;
            this.tool.onMouseDown=onMouseDown;
            this.tool.onMouseDrag=onMouseDrag;
            this.tool.onMouseMove=onMouseMove;
            this.root=root;
            this.isUp=true;
        }else{
            alert("请先初始化paper")
        }
    }
}
