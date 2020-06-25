import React, {useState} from 'react';
import {Tree, Button, Popover} from 'antd';
import * as paper from 'paper';
import EventHub from "../Common/Observer";
import {ToolEditPath} from "../MyCanvas/PaperTools";
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";

const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

let treeRef;
//用于保存layer的数组
let canvasTree = [{
    key: '0',
    title: 'None',
}];
//用于保存选择的节点、
let nodeCheckedArray = []
//当前选中的节点
let selectedKey = '-1'
// 更新数据树节点的数据
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
    nodeCheckedArray = paper.project.getItems({
        match: item => {
            return item.visible == false
        },
        class: paper.Path
    }).map(item => {
        return item.id.toString()
    })
    treeRef.tree.setState({
        checkedKeys: nodeCheckedArray
    })
    SelectedItem()
    setTreeDataGlobal(canvasTree)
}

/**
 * 选择当前选中的item，如果之前选中的item已经不存再，则选中其根节点
 * @param id
 */
const SelectedItem = () => {
    let item = paper.project.getItem({
        match: (item) => {
            return item.id == parseInt(selectedKey)
        }
    });
    if (item == null) {
        selectedKey = canvasTree[0].key.toString()
        treeRef.tree.setState({
            selectedKeys: [canvasTree[0].key.toString()]
        })
    } else {
        treeRef.tree.setState({
            selectedKeys: [selectedKey]
        })
    }
}

/**
 * 生成LayerList
 * @constructor
 */
const Layer = () => {
    //useState 是允许你在 React 函数组件中添加 state 的 Hook
    const [treeData, setTreeData] = useState(canvasTree);
    const [visible, setVisible] = useState(false);
    const [rightData, setRightData] = useState({
        id: 0,
        pageX: 0,
        pageY: 0,
        isSelected: false
    })
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
     * 删除某一项
     * @constructor
     */
    const DeleteItem = () => {
        let item = paper.project.getItem({
            match: (item) => {
                return item.id == parseInt(selectedKey)
            }
        });
        if (item != null) {
            EventHub.emit('pageChangeBefore', null)
            item.remove()
            EventHub.emit('pageChangeAfter', null)
        }
    }
    /**
     * 添加图层
     * @constructor
     */
    const AddLayer = () => {
        let item = paper.project.getItem({
            match: (item) => {
                return item.id == parseInt(selectedKey)
            }
        })
        if (item != null) {
            EventHub.emit('pageChangeBefore', null)
            let newLayer = new paper.Layer({
                name: 'Layer'
            })
            if (item.className == 'Layer') {
                item.insertChild(item.children.length, newLayer)
            } else {
                item.parent.addChild(newLayer)
            }
            selectedKey = newLayer.id.toString()
            newLayer.activate()
            SelectedItem()
            EventHub.emit('pageChangeAfter', null)
        }
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
                left: `${pageX + 35}px`,
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
                    EventHub.emit('pageChangeBefore', null)
                    let item = paper.project.getItem({id: id});
                    item.data.layerLayout='radialLayout'
                    ClearRightData()
                    EventHub.emit('pageChangeAfter', null)
                }} type='link'>Set RadialLayout</Button>
                <hr style={{
                    margin: '0px',
                    padding: '0px'
                }}/>
                <Button onClick={(e) => {
                    EventHub.emit('pageChangeBefore', null)
                    let item = paper.project.getItem({id: id});
                    delete item.data.layerLayout
                    ClearRightData()
                    EventHub.emit('pageChangeAfter', null)
                }} type='link'>Clear Layout</Button>
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
        if (event.clientY * 0.10 <= 68) {
            setRightData({
                pageX: event.currentTarget.offsetLeft,
                pageY: event.currentTarget.offsetTop,
                id: parseInt(node.key),
                isSelected: true
            })
        }

        if (event.clientY * 0.10 > 68) {
            setRightData({
                pageX: event.currentTarget.offsetLeft,
                pageY: event.currentTarget.offsetTop - 40,
                id: parseInt(node.key),
                isSelected: true
            })
        }
    }


    /**
     * 递归激活图层
     * @param layerChildren
     * @param id
     * @constructor
     */
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
        height: 'calc(35vh)',
        overflow: 'auto',
        position: 'relative'
    }}>
        <div className='layer-controls'>
            <div className='layer-controls-left'>
                <div className='layer-controls-box'>
                    <IconFont onClick={AddLayer} className='layer-controls-icon' type="icon-add"/>
                </div>
                <div className='layer-controls-box'>
                    <Popover content={<div>
                        <p>Are you sure to delete this node?</p>
                        <div style={{
                            textAlign: "center"
                        }}>
                            <Button onClick={() => {
                                DeleteItem()
                                setVisible(false)
                            }} type='primary'>Yes</Button>
                            <Button onClick={() => {
                                setVisible(false)
                            }} type='danger' style={{
                                marginLeft: '5px'
                            }}>No</Button>
                        </div>
                    </div>} title={'Delete'} trigger="click" visible={visible}>
                        <IconFont onClick={() => {
                            setVisible(true)
                        }} className='layer-controls-icon' type="icon-delete"/>
                    </Popover>
                </div>
            </div>
        </div>
        <Tree checkable
              onRightClick={RightClick}
              onCheck={(keys: string[], e: any) => {
                  let items: paper.Item[] = paper.project.getItems({
                      match: (item) => {
                          return keys.toString().indexOf(item.id.toString()) != -1 ? true : false;
                      },
                      class: paper.Path
                  })
                  ToolEditPath(items)
              }} treeData={treeDataGlobal}
              ref={(ref) => {
                  treeRef = ref
              }}
              onSelect={(keys: string[], e) => {
                  if (keys != null && keys.length != 0) {
                      selectedKey = keys[0]
                  } else {
                      console.log(selectedKey)
                      console.log(treeRef)
                      treeRef.tree.setState({
                          selectedKeys: [selectedKey]
                      })
                  }
              }}/>
        {CreateRightMenu()}
    </div>;
};
export default Layer;
export {
    Refresh
}
