//ts中引入的写法
import * as React from "react";
import * as paper from "paper";
//react中引入的写法
import { Layout } from 'antd';
import SplitPane from 'react-split-pane';
import './App.css';
import { useEffect } from "react";
import DrawHandle from "./UI/DrawHandle";
const { Header, Sider, Content } = Layout;

const App=()=>{
  let myCanvas = null;
  //此处仿照老师绑定canvas的方法
  useEffect(() => {
    paper.install(window);
    paper.setup(myCanvas)
  });

  return (
    <Layout className="me-layout">
      <Header className="me-header">
        ChartInk 0.1
      </Header>
      <Layout>
        <Sider width={48} className="me-left-bar">
          <DrawHandle></DrawHandle>
        </Sider>
        <Content className="me-canvas">
          <canvas 
          ref={ref=>{myCanvas=ref}}
          id="myCanvas"></canvas>
        </Content>
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