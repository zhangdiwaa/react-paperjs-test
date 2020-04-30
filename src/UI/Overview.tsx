import React, {useEffect} from "react";
import * as paper from 'paper';
import EventHub from "../Common/Observer";
import {PageChangeAfter, PageChangeBefore} from "../Common/UndoAndRedo";
import {Refresh} from "./Layers";
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";

const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

let canvas: HTMLCanvasElement = null;
//问题：概览视图的根容器Layer，按之前讨论的结果根容器应该为layer吗？
//问题：我们的内外径使用百分比计算

let inner = 0.3;
let outer = 0.8;
let glyphNum = 3;
let gap = 0.05;
let begin = 0;
let end = 360;

let singleAngle;
let topEdge;
let tan;
let topPointY;
let topPointX;

const RefreshOverview = () => {
    let chartRange = end - begin;
    let chartEdge = canvas.width > canvas.height ? canvas.height : canvas.width;
    let innerEdge = chartEdge / 2 * inner;
    let outerEdge = chartEdge / 2 * outer;
    singleAngle = chartRange * (1 - gap) / glyphNum;
    let singleGap = chartRange * gap / glyphNum;
    let bottomEdge = 2 * innerEdge * Math.sin(singleAngle / 360 * 3.1415926);
    topEdge = 2 * outerEdge * Math.sin(singleAngle / 360 * 3.1415926);
    tan = (1 - bottomEdge / topEdge) / 2 * topEdge / (outerEdge - innerEdge);
    paper.projects[1].activate();
    paper.projects[1].clear();
    let finishLayer = new paper.Layer({
        name: 'Layer1'
    });
    let layer = new paper.Layer({
        name: 'Layer2'
    });
    let item = layer.addChild(paper.projects[0].layers[0].clone());
    let angle: number = begin;
    for (let i: number = 0; i < glyphNum; i++) {
        let single = item.clone();
        topPointX = single.bounds.x;
        topPointY = single.bounds.y;
        // single.scale(topEdge / single.bounds.width, (outerEdge - innerEdge) / single.bounds.height)
        let scaleV = Math.min((outerEdge - innerEdge) / single.bounds.height, topEdge / single.bounds.width)
        single.scale(scaleV, scaleV)
        Reshape(single);
        finishLayer.addChild(single);
        single.translate(new paper.Point(-single.bounds.width / 2, -single.bounds.height / 2 - innerEdge))
        single.rotate(angle, new paper.Point(single.position.x, single.position.y + single.bounds.height / 2 + innerEdge));
        item = item.clone();
        angle += singleAngle + singleGap;
    }
    paper.projects[1].clear();
    paper.projects[1].addLayer(finishLayer)
    paper.projects[1].layers[0].fitBounds(paper.projects[1].view.bounds);
    //清除选中
    paper.projects[1].deselectAll();
    paper.projects[1].getItems({
        match: function (item) {
            if (item.bounds.selected == true) {
                item.bounds.selected = false;
            }
        }
    })
    //组件保持再激活状态，（目前看来是对某个project做出更改之后，就会激活对应的project，因此需要重新激活）
    paper.projects[0].activate()
}

//形变
function Reshape(item) {
    if (item.name == undefined) {
        return
    }
    if (item.name.indexOf('Layer') != -1) {
        for (let i = 0; i < item.children.length; i++) {
            Reshape(item.children[i])
        }
    } else {
        if (item.name.indexOf('Rectangle') != -1) {
            let numbers = new paper.Matrix().transform([1, 1, 101, 1, 1, 101, 101, 101], [1, 1, 101, 1, 21, 101, 81, 101], 4);
            console.log(numbers)
            // item.transform(new paper.Matrix(1, 0, 0, 1, -topPointX, -topPointY))
            // let segments = item.segments;
            // console.log(segments[0].point)
            // segments[0].point.x = (segments[0].point.x + 0 * segments[0].point.y + 0) / (-0.2 + 0 + 1)
            // segments[3].point.x = (segments[3].point.x + 0 * segments[3].point.y + 0) / (0.12 + 0 + 1)
            // segments[0].point.x = Math.abs(topPointY - segments[0].point.y) * tan + segments[0].point.x;
            // segments[1].point.x = Math.abs(topPointY - segments[1].point.y) * tan + segments[1].point.x;
            // segments[2].point.x = -Math.abs(topPointY - segments[2].point.y) * tan + segments[2].point.x;
            // segments[3].point.x = -Math.abs(topPointY - segments[3].point.y) * tan + segments[3].point.x;
        } else if (item.name.indexOf('Circle') != -1) {
            let segments = item.segments;
            item.transform(new paper.Matrix(1, 0, tan, 1, -topPointX, -topPointY))
            // item.transform(new paper.Matrix(1, 0, -tan, 1, 0, 0))
        }
    }
}

/**
 * 概览视图
 * @constructor
 */
const Overview = () => {
    useEffect(() => {
        paper.install(window);
        paper.setup(canvas);
        //清空localStorage
        localStorage.setItem("history", JSON.stringify([]))
        localStorage.setItem("future", JSON.stringify([]))
        // 当观察者收到mouseDownBefore的操作之后，执行pageChangeBefore方法
        EventHub.on('pageChangeBefore', [PageChangeBefore,])
        EventHub.on('pageChangeAfter', [PageChangeAfter,
            RefreshOverview,
            Refresh])
        EventHub.on('redo', [RefreshOverview,
            Refresh])
        EventHub.on('undo', [RefreshOverview,
            Refresh])
        //在此时便创建一个Layer,并触发事件
        paper.projects[0].activate()
        EventHub.emit('pageChangeBefore', null)
        new paper.Layer({
            name: 'Layer'
        })
        EventHub.emit('pageChangeAfter', null)
    })

    return (<div style={{
            height: 'calc(55vh)',
            overflow: 'auto',
            position: 'relative',
            margin: '0 5px'
        }}>
            <canvas style={{
                width: '100%',
                height: 'calc(51vh)',
            }
            } ref={(ref) => {
                canvas = ref
            }} id='canvasOverview'/>
            <div className='layer-controls'>
                <div className='layer-controls-left'>
                </div>
                <div className='layer-controls-right'>
                    <div className='layer-controls-box'>
                        <IconFont onClick={(e) => {
                            paper.projects[1].view.scale(1.5, 1.5)
                        }} className='layer-controls-icon' type="icon-zoomin"/>
                    </div>
                    <div className='layer-controls-box'>
                        <IconFont onClick={(e) => {
                            paper.projects[1].view.scale(0.5, 0.5)
                        }} className='layer-controls-icon' type="icon-zoomout"/>
                    </div>
                    <div className='layer-controls-box'>
                        <IconFont onClick={(e) => {
                            paper.projects[1].layers[0].fitBounds(paper.projects[1].view.bounds)
                        }} className='layer-controls-icon' type="icon-zoom1"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview;

export {
    RefreshOverview
}
