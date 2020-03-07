//ts中引入的写法
import * as React from "react";
//react中引入的写法
import { Layout } from 'antd';
import SplitPane from 'react-split-pane';
import MyCanvas from "./MyCanvas/MyCanvas";
import ToolMenu from "./UI/ToolMenu"
import HeaderBar from "./UI/HeaderBar"
import './App.css';

const { Header, Content } = Layout;

const App=()=>{

  return (
    <Layout className="me-layout">
        <HeaderBar></HeaderBar>
      <Layout>
        <ToolMenu></ToolMenu>
        <MyCanvas></MyCanvas>
        <Content className="me-right-bar">
            <SplitPane
              defaultSize="60%"
              split="horizontal"
              style={{ position: 'static' }}
              resizerStyle={{ padding: '5px' }}
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