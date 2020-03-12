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
  onRightClick = (e) => {
    this.setState({
      rightClickNodeTreeItem: {
        pageX: e.event.pageX,
        pageY: e.event.pageY,
        id: e.node.props["data-key"],
        categoryName: e.node.props["data-title"]
      }
    });
};
getNodeTreeRightClickMenu = () => {
  const { pageX, pageY, id, categoryName } = { ...this.state.rightClickNodeTreeItem };
  const tmpStyle = {
    position: 'absolute' as 'absolute',
    left:`${pageX + 20}px`,
    top: `${pageY}px`,
  };
  const menu = (
    <div style={tmpStyle} className="self-right-menu">
        <Menu>
        <Menu.Item>New</Menu.Item>
        <Menu.Item>Delete</Menu.Item>
        <Menu.Item>Rename</Menu.Item>
        </Menu>
    </div>
  );
  return this.state.rightClickNodeTreeItem == null ? "" : menu;
};
clearMenu = () => {
  this.setState({
    NodeTreeItem: null
  })
}
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
