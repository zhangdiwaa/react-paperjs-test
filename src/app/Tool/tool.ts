
import * as paper from "paper";

export class Tool{
    type:string;
    visible:boolean;
    constructor(visible:boolean){
        this.visible=visible;
    }
}

export class RectTool extends Tool{
    rectangle:any;
    tool:any;
    tool_nothing:any;
    last_shape:any;
    constructor(DomElement:string,visible:boolean){
        super(visible);
        if(paper.view==null){
            paper.setup(DomElement);
        }
        this.type="RectangleTool";
        this.tool=new paper.Tool();
        this.tool.visible=this.visible;
        this.tool_nothing=new paper.Tool();
        this.tool.onMouseDown=this.onMouseDown;
        this.tool.onMouseDrag=this.onMouseDrag;
        this.tool.onMouseUp=this.onMouseUp;
    }
    private onMouseDown(event:any,callback:Function){
        let p:any =new paper.Point(event.point)
        this.rectangle=new paper.Rectangle(p,p);
        this.last_shape=new paper.Path.Rectangle(this.rectangle);
        this.last_shape.strokeColor="black";
        this.last_shape.visible=this.visible;
    }
    private onMouseDrag(event:any){
        this.rectangle.bottomRight=event.point;
        this.last_shape.removeSegments();
        this.last_shape.addSegments([this.rectangle.topLeft,this.rectangle.topRight,this.rectangle.bottomRight,this.rectangle.bottomLeft])
    }
    private onMouseUp(event:any){

    }
    public activate(){
        this.tool.activate();
    }
    public hangUp(){
        this.tool_nothing.activate();
    }
    public setShapeVisible(){
        this.last_shape.visible=this.visible;
    }
}

export class CircleTool extends Tool{
    raidus:number;
    tool:any;
    tool_nothing:any;
    centerPoint:paper.Point;
    last_shape:any;
    constructor(DomElement:string,visible:boolean){
        super(visible);
        if(paper.view==null){
            paper.setup(DomElement);
        }
        this.type="CircleTool";
        this.tool=new paper.Tool();
        this.tool.visible=this.visible;
        this.tool_nothing=new paper.Tool();
        this.tool.onMouseDown=this.onMouseDown;
        this.tool.onMouseDrag=this.onMouseDrag;
        this.tool.onMouseUp=this.onMouseUp;
    }
    private onMouseDown(event:any){
        this.raidus=0;
        this.centerPoint=new paper.Point(event.point.x,event.point.y);
        this.last_shape=new paper.Shape.Circle(this.centerPoint,0);
        this.last_shape.strokeColor="black";
        this.last_shape.visible=this.visible;
    }
    private onMouseDrag(event:any){
        this.raidus=this.centerPoint.getDistance(event.point);
        this.last_shape.radius=this.raidus;

    }
    private onMouseUp(event:any){

    }
    public activate(){
        this.tool.activate();
    }
    public hangUp(){
        this.tool_nothing.activate();
    }
}

export class CurveTool extends Tool{
    tool:any;
    tool_nothing:any;
    last_shape:any;
    constructor(DomElement:string,visible:boolean){
        super(visible);
        if(paper.view==null){
            paper.setup(DomElement);
        }
        this.type="CurveTool";
        this.tool=new paper.Tool();
        this.tool.visible=this.visible;
        this.tool_nothing=new paper.Tool();
        this.tool.onMouseDown=this.onMouseDown;
        this.tool.onMouseDrag=this.onMouseDrag;
        this.tool.onMouseUp=this.onMouseUp;
    }
    private onMouseDown(event:any){
        this.last_shape=new paper.Path();
        this.last_shape.strokeColor='black';
        this.last_shape.visible=this.visible;
        this.last_shape.add(event.point);
    }
    private onMouseDrag(event:any){
        this.last_shape.add(event.point.round());
    }
    private onMouseUp(event:any){

    }
    public activate(){
        this.tool.activate();
    }
    public hangUp(){
        this.tool_nothing.activate();
    }
}

export class LineTool extends Tool{
    tool:any;
    tool_nothing:any;
    last_shape:any;
    startPoint:paper.Point;
    constructor(DomElement:string,visible:boolean){
        super(visible);
        if(paper.view==null){
            paper.setup(DomElement);
        }
        this.type="LineTool";
        this.tool=new paper.Tool();
        this.tool_nothing=new paper.Tool();
        this.tool.visible=this.visible;
        this.tool.onMouseDown=this.onMouseDown;
        this.tool.onMouseDrag=this.onMouseDrag;
        this.tool.onMouseUp=this.onMouseUp;
    }
    private onMouseDown(event:any){
        this.startPoint=event.point;
        this.last_shape=new paper.Path(this.startPoint);
        this.last_shape.strokeColor='black';
        this.last_shape.visible=this.visible;
        this.last_shape.add(event.point);
    }
    private onMouseDrag(event:any){
        this.last_shape.removeSegments();
        this.last_shape.addSegments([this.startPoint,event.point]);
    }
    private onMouseUp(event:any){

    }
    public activate(){
        this.tool.activate();
    }
    public hangUp(){
        this.tool_nothing.activate();
    }
}

export class EllipseTool extends Tool{
    tool:any;
    tool_nothing:any;
    rectangle:paper.Rectangle;
    centerPoint:paper.Point;
    last_shape:any;
    startPoint:paper.Point;
    constructor(DomElement:string,visible:boolean){
        super(visible);
        if(paper.view==null){
            paper.setup(DomElement);
        }
        this.type="EllipseTool";
        this.tool=new paper.Tool();
        this.tool_nothing=new paper.Tool();
        this.tool.visible=this.visible;
        this.tool.onMouseDown=this.onMouseDown;
        this.tool.onMouseDrag=this.onMouseDrag;
        this.tool.onMouseUp=this.onMouseUp;
    }
    private onMouseDown(event:any){
        this.centerPoint=event.point;
        this.rectangle=new paper.Rectangle(this.centerPoint,this.centerPoint);
        this.last_shape=new paper.Shape.Ellipse(this.rectangle);
        this.last_shape.strokeColor='black';
        this.last_shape.visible=this.visible;
    }
    private onMouseDrag(event:any){
        this.last_shape.radius=new paper.Size(this.centerPoint.clone().subtract(event.point).multiply(1.4).abs());
    }
    private onMouseUp(event:any){
        
    }
    public activate(){
        this.tool.activate();
    }
    public hangUp(){
        this.tool_nothing.activate();
    }
}