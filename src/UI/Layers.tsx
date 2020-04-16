import React, {ReactDOM, useState} from 'react';
import {Tree, Button} from 'antd';
import * as paper from 'paper';
import EventHub from "../Common/Observer";
import HeaderBar from "./HeaderBar";

let treeRef;
//用于保存layer的数组
let canvasTree = [{
    key: '0',
    title: 'None',
}];
//用于保存选择的节点、
let nodeCheckedArray = []

//菜单的数据
const menuOptions = {}

let treeDataGlobal, setTreeDataGlobal;
/**
 * 加载Layer的children对象
 * @param layerChild
 */
const loadChildren = (layerChild) => {
    //将child保存为数组
    let leaf = [];
    //便利layer的child,生成node，并添加到数组中
    for (let i = 0; i < layerChild.length; i++) {
        if (layerChild[i].className == 'Group') {
            continue
        }
        const leafNode = {
            key: layerChild[i].id.toString(),
            title: layerChild[i].name,
            children: []
        }
        if (layerChild[i].children != null) {
            leafNode.children = loadChildren(layerChild[i].children)
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
const Refresh = () => {
    //清空canvasTree
    canvasTree.splice(0)
    //获取所有layer
    let layers = paper.project.layers;
    if (layers.length == 0) {
        setTreeDataGlobal([{
            key: '0',
            title: 'None',
            checked: true
        }])
        return
    }
    //对layer进行遍历
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].className === 'Group') {
            continue;
        }
        const layerNode = {
            key: layers[i].id.toString(),
            title: layers[i].name,
            children: []
        }
        //对layer的children进行解析，返回结果保存
        let leaf = loadChildren(layers[i].children);
        layerNode.children = leaf
        //将layer保存
        canvasTree = [...canvasTree, layerNode]
    }
    treeRef.tree.setState({
        checkedKeys: paper.project.getItems({
            visible: false
        }).map(item => {
            return item.id.toString()
        })
    })
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
    //保存为全局变量
    treeDataGlobal = treeData
    setTreeDataGlobal = setTreeData
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
                left: `${pageX +35}px`,
                top: `${pageY}px`,
                border: '1px solid #ccc',
                backgroundColor: '#fff'
            }} onMouseLeave={(e) => {
                ClearRightData()
            }}>
                <Button onClick={(e) => {
                    EventHub.emit('pageChangeBefore', null)
                    paper.project.getItems({id: id}).forEach(item => {
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
                <hr style={{
                    margin: '0px',
                    padding: '0px'
                }}/>
                <Button onClick={(e) => {
                    if (id === 0) {
                        return;
                    }
                    EventHub.emit('pageChangeBefore', null)
                    let item = paper.project.getItem({id: id});
                    if (item.className === 'Layer') {
                        let newLayer = new paper.Layer({
                            name: 'Layer'
                        })
                        item.insertChild(item.children.length, newLayer)
                        newLayer.activate()
                    }
                    ClearRightData()
                    EventHub.emit('pageChangeAfter', null)
                }} type='link'>Add Layer</Button>
                <hr style={{
                    margin: '0px',
                    padding: '0px'
                }}/>
                <Button onClick={(e) => {
                    EventHub.emit('pageChangeBefore', null)
                    let item = paper.project.getItem({id: id});
                    if (item.className === 'Layer') {
                        paper.project.layers.forEach(layer => {
                            if (layer.id == id) {
                                layer.activate()
                            } else {
                                ActivateLayer(layer.children, id)
                            }
                        })
                    }
                    ClearRightData()
                    EventHub.emit('pageChangeBefore', null)
                }} type='link'>Activate Layer</Button>
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
        if(event.clientY * 0.21 <= 136){
            setRightData({
                pageX: event.currentTarget.offsetLeft,
                pageY: event.currentTarget.offsetTop,
                id: parseInt(node.key),
                isSelected: true
            })
        }

        if(event.clientY * 0.21 > 136){
            setRightData({
                pageX: event.currentTarget.offsetLeft,
                pageY: event.currentTarget.offsetTop - 108,
                id: parseInt(node.key),
                isSelected: true
            })
        }

    }

    const ActivateLayer = (layerChildren: any[], id: number) => {
        layerChildren.forEach(item => {
            if (item.children != null) {
                ActivateLayer(item.children, id)
            }
            if (item.id == id) {
                item.activate();
                return
            }
        })
    }

    return <div style={{
        width: '100%',
        height: 'calc(33.5vh)',
        overflow: 'auto',
        position: 'relative'
    }}>
        <Tree checkable={true}
              onRightClick={RightClick}
              onCheck={(keys, e) => {
                  let items: paper.Item[] = []
                  for (let key in keys) {
                      items.push(paper.project.getItem({id: parseInt(key)}))
                  }
              }} treeData={treeDataGlobal}
              ref={(ref) => {
                  treeRef = ref
              }}
              onSelect={(keys, e) => {
                  console.log(keys)
              }}/>
        {CreateRightMenu()}
    </div>;
};
export default Layer;
export {
    Refresh
}
