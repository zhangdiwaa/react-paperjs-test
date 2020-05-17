import * as paper from "paper"
import EventHub from "../Common/Observer";
import React, {useEffect, useState} from "react";
import {Button, Layout} from "antd";
const GridLayout = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    let Group:paper.Group=new paper.Group()
    let children=[]
    for(let i=0;i<16;i++){
        children.push(new paper.Path.Circle({
            center: new paper.Point(100,100),
            radius: Math.random()*10+20,
            strokeColor: "black",
            name: 'Circle'
        }))
    }
    Group.addChildren(children)
    console.log(Group.children)
    let Group2:paper.Group=new paper.Group()
    let PointPosition=[]
    for(let i=0;i<4;i++){    
        for(let j=0;j<4;j++){
            PointPosition.push(new paper.Path.Rectangle({
            from:new paper.Point(100*j,100*i),
            to : new paper.Point(100+100*j,200+100*i),
            strokeColor: "black",
            name: 'Rectangle'
        }))
    }
    }
    Group2.addChildren(PointPosition)
    console.log(Group2.children)
    for(let i=0;i<16;i++){
     
        console.log(Group2.children[i])
        Group.children[i].position = Group2.children[i].position
    }
    

}
const XaxisLayout = () => {
    RemoveTool()
    let Group:paper.Group=new paper.Group()
    let children=[]
    for(let i=0;i<16;i++){
        children.push(new paper.Path.Circle({
            center: new paper.Point(100,100),
            radius: Math.random()*10+20,
            strokeColor: "black",
            name: 'Circle'
        }))
    }
    Group.addChildren(children)
    console.log(Group.children)
    let Group2:paper.Group=new paper.Group()
    let PointPosition=[]
    for(let i=0;i<16;i++){    
            PointPosition.push(new paper.Path.Rectangle({
            from:new paper.Point(100*i,100),
            to : new paper.Point(100+100*i,200),
            strokeColor: "black",
            name: 'Rectangle'
        }))
    }
    Group2.addChildren(PointPosition)
    console.log(Group2.children)
    for(let i=0;i<16;i++){
     
        console.log(Group2.children[i])
        Group.children[i].position = Group2.children[i].position
    }
}
const YaxisLayout = () => {
    RemoveTool()
    let Group:paper.Group=new paper.Group()
    let children=[]
    for(let i=0;i<16;i++){
        children.push(new paper.Path.Circle({
            center: new paper.Point(100,100),
            radius: Math.random()*10+20,
            strokeColor: "black",
            name: 'Circle'
        }))
    }
    Group.addChildren(children)
    console.log(Group.children)
    let Group2:paper.Group=new paper.Group()
    let PointPosition=[]
    for(let i=0;i<16;i++){    
            PointPosition.push(new paper.Path.Rectangle({
            from:new paper.Point(100,100*i),
            to : new paper.Point(200,100+100*i),
            strokeColor: "black",
            name: 'Rectangle'
        }))
    }
    Group2.addChildren(PointPosition)
    console.log(Group2.children)
    for(let i=0;i<16;i++){
     
        console.log(Group2.children[i])
        Group.children[i].position = Group2.children[i].position
    }
}
const XYaxisLayout = () => {
    RemoveTool()
    let Group:paper.Group=new paper.Group()
    let children=[]
    for(let i=0;i<16;i++){
        children.push(new paper.Path.Circle({
            center: new paper.Point(100,100),
            radius: Math.random()*10+20,
            strokeColor: "black",
            name: 'Circle'
        }))
    }
    Group.addChildren(children)
    console.log(Group.children)
    let Group2:paper.Group=new paper.Group()
    let PointPosition=[]
    for(let i=0;i<16;i++){         
            PointPosition.push(new paper.Path.Rectangle({
            from:new paper.Point(100+200*i,100+200*i),
            to : new paper.Point(200+200*i,200+200*i),
            strokeColor: "black",
            name: 'Rectangle'
        }))   
    }
    Group2.addChildren(PointPosition)
    console.log(Group2.children)
    for(let i=0;i<16;i++){
     
        console.log(Group2.children[i])
        Group.children[i].position = Group2.children[i].position
    }
}
const RemoveTool = () => {
    //先清除所有的工具
    paper.tools.forEach((item) => {
        item.remove()
    })
}
export {
    GridLayout,
    XaxisLayout,
    YaxisLayout,
    XYaxisLayout
}