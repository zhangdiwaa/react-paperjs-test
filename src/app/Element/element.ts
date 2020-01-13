export interface Element {
    type: string;
}

export class Point implements Element{
    type: "point";
    x: number;
    y: number;
    instance:any;
    constructor(x:number =0, y:number=0){
        this.x=x;
        this.y=y;
    };
    public clone():Point{
        return new Point(this.x,this.y);
    };
}

export class Rect implements Element {
    type: "rect";
    p1: Point;
    p2: Point;
    instance:any;
    constructor(p1:Point,p2:Point){
        this.p1=p1.clone();
        this.p2=p2.clone();
    }
    public clone():Rect{
        return new Rect(this.p1,this.p1);
    };
}

export class Segment implements Element {
    type: "segment";
    p1: Point;
    p2: Point;
    instance:any;
    constructor(p1:Point,p2:Point){
        this.p1=p1.clone();
        this.p2=p2.clone();
    }
    public clone():Segment{
        return new Segment(this.p1,this.p1);
    };
}

export class Circle implements Element {
    type: "circle";
    p1: Point;
    p2: Point;
    r: number;
    instance:any;
    constructor(p1:Point,p2:Point,r:number){
        this.p1=p1.clone();
        this.p2=p2.clone();
        this.r=r;
    }
    public clone():Circle{
        return new Circle(this.p1,this.p2,this.r);
    }
}

export class Ellipse implements Element {
    type: "ellipse";
    p1: Point;
    p2: Point;
    instance:any;
    constructor(p1:Point,p2:Point){
        this.p1=p1.clone();
        this.p2=p2.clone();
    }
    public clone():Ellipse{
        return new Ellipse(this.p1,this.p2);
    }
}

export class Curve implements Element{
    type: "Curve";
    points: Point[];
    instance:any;
    constructor(points:Point[]){
        points.forEach((point)=>{
            this.points.push(point.clone());
        })
    }
}

