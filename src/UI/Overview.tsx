import React, {useEffect} from "react";
import * as paper from 'paper';
import EventHub from "../Common/Observer";
import {PageChangeAfter, PageChangeBefore} from "../Common/UndoAndRedo";
import {Refresh} from "./Layers";
import * as Paper from "paper";
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";

const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

const RefreshOverview = () => {
    let paperJSON = paper.project.exportJSON()
    paper.projects[1].clear()
    paper.projects[1].importJSON(paperJSON)
    paper.projects[1].deselectAll();
    //组件保持再激活状态，（目前看来是对某个project做出更改之后，就会激活对应的project，因此需要重新激活）
    paper.projects[0].activate()
}
/**
 * 概览视图
 * @constructor
 */
const Overview = () => {
    let canvas: HTMLCanvasElement = null;

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
        new Paper.Layer({
            name: 'Layer'
        })
        EventHub.emit('pageChangeAfter', null)
    })

    return (<div style={{
            // width: '100%',
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
