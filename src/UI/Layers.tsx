import React, {ReactDOM, useState} from 'react';
import {Tree, Button} from 'antd';
import * as Paper from 'paper';
import EventHub from "../Common/Observer";

let treeRef;
//用于保存layer的数组
let canvasTree = [{
    key: '0',
    title: 'None',
}];
//用于保存选择的节点、
let nodeCheckedArray = []
//展开的节点
let nodeExpandArray = []

//菜单的数据
const menuOptions = {}

let treeDataGlobal, setTreeDataGlobal;
let nodeCheckedGlobal, setNodeCheckedGlobal;
let nodeExpandGlobal, setNodeExpandGlobal;
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
    if (layers.length == 0) {
        setTreeDataGlobal([{
            key: '0',
            title: 'None',
        }])
        return
    }
    //对layer进行遍历
    for (let i = 0; i < layers.length; i++) {
        const layerNode = {
            key: layers[i].id.toString(),
            title: layers[i].className,
            children: []
        }
        //对layer的children进行解析，返回结果保存
        let leaf = parseLeafJSON(layers[i].children);
        layerNode.children = leaf
        //将layer保存
        canvasTree = [...canvasTree, layerNode]
    }
    setTreeDataGlobal(canvasTree)
}
const RightMenu = () => {

}

const treeSelect = () => {

}
/**
 * 生成LayerList
 * @constructor
 */
const Layer = () => {
    //useState 是允许你在 React 函数组件中添加 state 的 Hook
    const [treeData, setTreeData] = useState(canvasTree);
    const [rightData, setRightData] = useState({
        id: 0,
        pageX: 0,
        pageY: 0,
        isSelected: false
    })
    const [checkedData, setCheckedData] = useState(nodeCheckedArray)
    const [expandedData, setExpandData] = useState(nodeExpandArray)
    //保存为全局变量
    treeDataGlobal = treeData
    setTreeDataGlobal = setTreeData
    nodeCheckedGlobal = checkedData
    setNodeCheckedGlobal = setCheckedData
    nodeExpandGlobal = expandedData
    setNodeExpandGlobal = setExpandData
    /**
     * 用于清除右键菜单
     * @constructor
     */
    const ClearRightData = () => {
        setRightData({
            id: 0,
            pageX: 0,
            pageY: 0,
            isSelected: false
        })
    }
    /**
     * 生成右键菜单
     * @constructor
     */
    const CreateRightMenu = () => {
        //获取数据
        const {id, pageX, pageY} = rightData;
        //menu菜单
        const menu = (
            <div style={{
                position: 'absolute',
                textAlign: 'center',
                left: `${pageX + 20}px`,
                top: `${pageY}px`,
                border: '1px solid #ccc',
                backgroundColor: '#fff'
            }} onMouseLeave={(e) => {
                ClearRightData()
            }}>
                <Button onClick={(e) => {
                    EventHub.emit('pageChangeBefore', null)
                    Paper.project.getItems({id: id}).forEach(item => {
                        item.remove()
                    })
                    ClearRightData()
                    EventHub.emit('pageChangeAfter', null)
                }} type='link'>Delete</Button>
                <hr style={{
                    margin: '0px',
                    padding: '0px'
                }}/>
                <Button type='link'>Edit</Button>
            </div>
        )
        return rightData.isSelected ? menu : ''
    }
    /**
     * 在LayerList上右击之后，执行的操作
     * @param event 事件
     * @param node 被选中的节点
     * @constructor
     */
    const RightClick = ({event, node}) => {
        setRightData({
            pageX: event.currentTarget.offsetLeft,
            pageY: event.currentTarget.offsetTop,
            id: parseInt(node.key),
            isSelected: true
        })
    }

    return <div style={{
        width: '300px',
        height: '300px',
        overflow: 'scroll',
        position: 'relative'
    }}>
        <Tree checkable={true}
              autoExpandParent={true}
              defaultExpandAll={true}
              onRightClick={RightClick}
              onCheck={(keys, e) => {
              }} treeData={treeDataGlobal}
              ref={(ref) => {
                  treeRef = ref
              }}
              expandedKeys={nodeExpandGlobal}
              checkedKeys={nodeCheckedGlobal}
              onExpand={(keys, {expanded, node}) => {
                  console.log(node)
                  if (expanded) {
                      node.expanded=true
                      nodeExpandArray.push(node.key)
                  } else {
                      nodeExpandArray.splice(nodeExpandArray.indexOf(node.key), 1)
                  }
                  console.log(nodeExpandArray)
                  console.log(nodeExpandGlobal)
                  setNodeExpandGlobal(nodeExpandArray)
                  console.log(treeRef)
                  // treeRef.renderTree()
              }}
        />
        {CreateRightMenu()}
    </div>;
};
export default Layer;
export {
    LoadLayer
}