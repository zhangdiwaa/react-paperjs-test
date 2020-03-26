import React, {useEffect} from "react";
import * as paper from 'paper';
import EventHub from "../Common/Observer";
import {PageChangeAfter, PageChangeBefore} from "../Common/UndoAndRedo";
import {Refresh} from "./Layers";
import * as Paper from "paper";

const RefreshOverview = () => {
    let paperJSON = paper.project.exportJSON()
    paper.projects[1].clear()
    paper.projects[1].importJSON(paperJSON)
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
        console.log(paper.projects)
        //清空localStorage
        localStorage.setItem("history", JSON.stringify([]))
        localStorage.setItem("future", JSON.stringify([]))

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

    return (<canvas style={{
        width: '100%',
        height: '100%',
    }
    } ref={(ref) => {
        canvas = ref
    }} id='canvasOverview'/>)
}

export default Overview;

export {
    RefreshOverview
}
