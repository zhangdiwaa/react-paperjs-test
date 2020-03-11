//ts中引入的写法
import * as React from "react";
//react中引入的写法
import { Layout } from 'antd';
import SplitPane from 'react-split-pane';
import MyCanvas from "./MyCanvas/MyCanvas";
import SiderBar from "./UI/SiderBar"
import HeaderBar from "./UI/HeaderBar"
import Layer from "./UI/Layers"
import Menu from "./UI/Layers"
import './App.css';

const { Content } = Layout;

const App=()=>{

  return (
    <Layout className="me-layout">
        <HeaderBar></HeaderBar>
      <Layout>
        <SiderBar></SiderBar>
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
              <div >wawawawa</div>
              <div>
                <Layer></Layer>
                <Menu></Menu>
              </div>
              <div />
            </SplitPane>
          </Content>
      </Layout>
    </Layout>
  );
}

export default App;