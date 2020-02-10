import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import SplitPane from 'react-split-pane';
import './App.css';
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

function App(){
  return (
    <Layout className="me-layout">
      <Header>
        Header
      </Header>
      <Layout>
        <Sider width={48} className="me-left-bar">
          Sider
        </Sider>
        <Content className="me-canvas">
        </Content>
        <Content className="me-right-bar">
          <SplitPane
            defaultSize="60%"
            split="horizontal"
            style={{position: 'static'}}
            resizerStyle={{padding:'5px'}}
            paneStyle={{ background: '#eee' }}
            pane2Style={{ background: '#aaa4ba' }}
          >
            <div />
            <div />
          </SplitPane>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;