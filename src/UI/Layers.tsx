import React, { useState,Component } from 'react';
import { Tree,Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { TreeNode } = Tree;
const {SubMenu} = Menu;
class App extends Component {
    sonSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);  
    } 
    state = {
      rightClickNodeTreeItem: {
        pageX: "",
        pageY: "",
        id: "",
        categoryName: ""
      }
  }
  /**
   * 定义鼠标右键事件
   */
  onRightClick = (e) => {
    /**
     * 设置位置，使右键菜单出现在鼠标右侧不远处
     */
    var x = e.event.currentTarget.offsetLeft + e.event.currentTarget.clientWidth;
    var y = e.event.currentTarget.offsetTop ;
    this.setState({
      rightClickNodeTreeItem: {
        pageX: x,
        pageY: y,
        id: e.node.props["data-key"],
        categoryName: e.node.props["data-title"]
      }
    });
};
/**
 * 清理组件函数，调用之后，使得右键菜单在点击之后消失
 */
clearMenu = () => {
  this.setState({
    rightClickNodeTreeItem: null
  })
}
/**
 * 自定义右键菜单，包括样式等等
 */
getNodeTreeRightClickMenu = () => {
  const { pageX, pageY, id, categoryName } = { ...this.state.rightClickNodeTreeItem };
  const tmpStyle = {
    position: 'absolute' as 'absolute',
    textAlign: 'center'as 'center',
    left:`${pageX + 40}px`,
    top: `${pageY}px`,
  };
  const menu = (
    <div style={tmpStyle} className="self-right-menu">
        <Menu>
        <Menu.Item onClick={this.clearMenu}>New</Menu.Item>
        <Menu.Item onClick={this.clearMenu}>Delete</Menu.Item>
        <Menu.Item onClick={this.clearMenu}>Rename</Menu.Item>
        </Menu>
    </div>
  );
  return this.state.rightClickNodeTreeItem == null ? "" : menu;
};
/**
 * 树状组件以及右键菜单输出
 */
    render() {      
        return (
          <div>
          <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={this.sonSelect}
          onRightClick={this.onRightClick}         
        >
          <TreeNode title="parent 1" key="0-0" >
            <TreeNode title="parent 1-0" key="0-0-0" >
              <TreeNode title="leaf" key="0-0-0-0" />
              <TreeNode title="leaf" key="0-0-0-1" />
              <TreeNode title="leaf" key="0-0-0-2" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title="leaf" key="0-0-1-0" />
            </TreeNode>
            <TreeNode title="parent 1-2" key="0-0-2">
              <TreeNode title="leaf" key="0-0-2-0" />
              <TreeNode title="leaf" key="0-0-2-1" />
            </TreeNode>
          </TreeNode>
        </Tree> 
        {this.getNodeTreeRightClickMenu()}
        </div>
      );
    }
}
export default App;
