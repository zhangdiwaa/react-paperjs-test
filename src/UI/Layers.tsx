import React, { useState,Component } from 'react';
import { Tree,Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { TreeNode } = Tree;
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
    id:any;
    categoryName:any;
    // tree列表上右键事件
    onRightClick = (e) => {    
      this.setState({      
        display: 'block',     
         rightClickNodeTreeItem: {       
            pageX: e.event.pageX,        
            pageY: e.event.pageY,        
            id: e.node.props['data-key'],     
            categoryName: e.node.props['data-title'],    
            contextMenuVisiable: true,  
            contextMenuStyle: { top: e.event.clientY, left: e.event.clientX },
          },    
        });
    };

    getNodeTreeRightClickMenu = () => {      
      const { pageX, pageY, id, categoryName } = { ...this.state.rightClickNodeTreeItem };     
          const tmpStyle = {
            height: 200,
            lineHeight: '200px',
          }; 
          const menu = (
            <div style={tmpStyle} className="self-right-menu">
              <a >新建图层</a>
              <a >删除图层</a>
              <a >隐藏图层</a>
              <a >显示图层</a>
              <a >重命名图层</a>
            </div>
          );
          return this.state.rightClickNodeTreeItem == null ? "" : menu;
        }
    render() {      
        return (
          <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={this.sonSelect}
          onRightClick={this.onRightClick }
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
        
      );
    }
}
export default App;
