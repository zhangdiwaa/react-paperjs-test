import React, {ReactDOM, useState} from 'react';
import {Tree} from 'antd';
import * as Paper from 'paper';

//用于保存layer的数组
let canvasTree = [];

let treeDataGlobal, setTreeDataGlobal;
/**
 * 加载Layer的children对象
 * @param layerChild
 */
const parseLeafJSON = (layerChild) => {
    //将child保存为数组
    let leaf = [];
    //便利layer的child,生成node，并添加到数组中
    for (let i = 0; i < layerChild.length; i++) {
        const leafNode = {
            key: layerChild[i].id.toString(),
            title: layerChild[i].name
        }
        leaf = [...leaf, leafNode]
    }
    //返回数组在其中保存
    return leaf
}

/**
 * 当页面改变之后，重新对Layer进行渲染，Layer调用对其Children的渲染
 * @constructor
 */
const LoadLayer = () => {
    //清空canvasTree
    canvasTree.splice(0)
    //获取所有layer
    let layers = Paper.project.layers;
    //对layer进行遍历
    for (let i = 0; i < layers.length; i++) {
        const layerNode = {
            key: layers[i].id.toString(),
            title: layers[i].className,
            children: []
        }
        //对layer的children进行解析，返回结果保存
        let leaf = parseLeafJSON(layers[i].children,);
        layerNode.children = leaf
        //将layer保存
        canvasTree = [...canvasTree, layerNode]
    }
    setTreeDataGlobal(canvasTree)
}
/**
 * 生成LayerList
 * @constructor
 */
const Layer = () => {
    //useState 是允许你在 React 函数组件中添加 state 的 Hook
    const [treeData, setTreeData] = useState(canvasTree);
    //保存为全局变量
    treeDataGlobal = treeData
    setTreeDataGlobal = setTreeData

    return <div style={{
        width: '200px',
        height: '200px',
        overflow: 'scroll',
        position: 'relative'
    }}>
        <Tree defaultExpandAll={true}
              onSelect={(sk, e) => {
                  //清除之前已经选中的
                  Paper.project.layers.forEach(layer => {
                      layer.selected = false
                  })
                  //选中点击的对象
                  Paper.project.getItems({id: parseInt(sk[0].toString())}).forEach(item => {
                      item.selected = true
                  })
              }} treeData={treeDataGlobal}/>
    </div>;
};
export default Layer;
export {
    LoadLayer
}
