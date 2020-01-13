import { Point } from "../Element/element"

export abstract class CoordinateSystem{
    centerPoint:Point;
    type:string;
    constructor(center:Point){
        this.centerPoint=center.clone();
    }
}

export class CartesianCoordinate extends CoordinateSystem{
    type:"CartesianCoordinate";
    constructor(public center:Point){
        super(center);
    }
    clone():CoordinateSystem{
        return new CartesianCoordinate(this.centerPoint.clone());
    }
}

export class PolarCoordinates extends CoordinateSystem{
    type:"PolarCoordinate";
    angle:number;
    radius:number;
    constructor(public center:Point,angle:number,radius:number){
        super(center);
        this.angle=angle;
        this.radius=radius;
    }
    clone():PolarCoordinates{
        return new PolarCoordinates(this.centerPoint.clone(),this.angle,this.radius);
    }
}