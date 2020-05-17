import React, {useEffect} from "react";
import * as paper from 'paper';
import EventHub from "../Common/Observer";
import {PageChangeAfter, PageChangeBefore} from "../Common/UndoAndRedo";
import {Refresh} from "./Layers";
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";
import * as PerspT from 'perspective-transform';

const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

let canvas: HTMLCanvasElement = null;
//问题：概览视图的根容器Layer，按之前讨论的结果根容器应该为layer吗？
//问题：我们的内外径使用百分比计算

//内径占多少
let inner = 0.3;
//外径占多少
let outer = 0.8;
//glyph的数量
let glyphNum = 15;
//每个glyph之间相隔的角度之和
let gap = 0.05;
//开始的角度
let begin = 0;
//结束的角度
let end = 180;

//每个图源所占的角度
let singleAngle;
//上底、下底的理论长度
let topEdge;
let bottomEdge;
//仿射变换的tan值
let tan;
//bounds的左上点
let topPointY;
let topPointX;
//透射变换
let perspT;

//copy
export interface RigidTransform {
    x: number;
    y: number;
    angle: number;
}

const RefreshOverview = () => {
    //求图表的范围
    let chartRange = end - begin;
    //查看概览视图的最短边
    let chartEdge = canvas.width > canvas.height ? canvas.height : canvas.width;
    //求内径
    let innerEdge = chartEdge / 2 * inner;
    //求外径
    let outerEdge = chartEdge / 2 * outer;
    singleAngle = chartRange * (1 - gap) / glyphNum;
    //每个glyph之间间距
    let singleGap = 0;
    if (Math.abs(chartRange) === 360) {
        singleGap = chartRange * gap / glyphNum
    } else {
        singleGap = chartRange * gap / (glyphNum - 1)
    }
    //下底的长度
    bottomEdge = 2 * innerEdge * Math.sin(singleAngle / 360 * 3.1415926);
    //上底的长度
    topEdge = 2 * outerEdge * Math.sin(singleAngle / 360 * 3.1415926);
    //仿射变换的tan值
    tan = (1 - bottomEdge / topEdge) / 2 * topEdge / (outerEdge - innerEdge);
    paper.projects[1].activate();
    paper.projects[1].clear();
    //创建两个Layer,一个是用于复制，另一个用于保存
    let finishLayer = new paper.Layer({
        name: 'Layer1'
    });
    let layer = new paper.Layer({
        name: 'Layer2'
    });
    //复制一份Layer
    let item = layer.addChild(paper.projects[0].layers[0].clone());
    let angle: number = begin + singleAngle / 2;
    for (let i: number = 0; i < glyphNum; i++) {
        let single = item.clone();
        topPointX = single.bounds.x;
        topPointY = single.bounds.y;
        //对glyph进行缩放
        single.scale(topEdge / single.bounds.width, (outerEdge - innerEdge) / single.bounds.height)
        // let scaleV = Math.min((outerEdge - innerEdge) / single.bounds.height, topEdge / single.bounds.width)
        // single.scale(scaleV, scaleV)
        //添加到展示图源
        finishLayer.addChild(single);
        //对glyph进行形变
        let bounds = single.bounds
        let bottomLeft = bounds.bottomLeft
        let bottomRight = bounds.bottomRight
        let topLeft = bounds.topLeft
        let topRight = bounds.topRight
        let bottomRate = (1 - innerEdge / outerEdge) / 2
        let srcCorners = [bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, topRight.x, topRight.y, bottomRight.x, bottomRight.y]
        let distCorners = [bottomLeft.x - (bottomLeft.x - bottomRight.x) * bottomRate, bottomLeft.y - (bottomLeft.y - bottomRight.y) * bottomRate, topLeft.x, topLeft.y, topRight.x, topRight.y, bottomRight.x + (bottomLeft.x - bottomRight.x) * bottomRate, bottomRight.y + (bottomLeft.y - bottomRight.y) * bottomRate]
        perspT = PerspT(srcCorners, distCorners)
        Reshape(single);
        //对glyph进行旋转
        single.rotate(-angle, new paper.Point(single.position.x, single.position.y + single.bounds.height / 2 + innerEdge));
        //调整角度
        angle += singleAngle + singleGap;
    }
    //清空canvas
    paper.projects[1].clear();
    //添加展示layer
    paper.projects[1].addLayer(finishLayer)
    //位移到中心
    paper.projects[1].layers[0].fitBounds(paper.projects[1].view.bounds);
    //清除选中和边框选中
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

/**
 * 形变,依靠我们设定的name
 * @param item
 * @constructor
 */
function Reshape(item) {
    if (item.name == undefined) {
        return
    }
    if (item.name.indexOf('Layer') != -1) {
        for (let i = 0; i < item.children.length; i++) {
            Reshape(item.children[i])
        }
    } else {
        if (item.name.indexOf('Rectangle') !== -1 || item.name.indexOf('Segment') !== -1 || item.name.indexOf('Path') !== -1) {
            let segments = item.segments;
            for (let i = 0; i < segments.length; i++) {
                let transformPoint = perspT.transform(segments[i].point.x, segments[i].point.y);
                segments[i].point.x = transformPoint[0]
                segments[i].point.y = transformPoint[1]
            }
        } else if (item.name.indexOf('Circle') !== -1) {
        } else if (item.name.indexOf('Text') != -1) {
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
