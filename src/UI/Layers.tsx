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
clearMenu = () => {
  this.setState({
    rightClickNodeTreeItem: null
  })
}
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
