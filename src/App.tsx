//ts中引入的写法
import * as React from "react";
//react中引入的写法
import { Layout } from 'antd';
import Sidebar from './UI/Sidebar'
import SplitPane from 'react-split-pane';
import { PaperContainer, Circle, Layer } from '@psychobolt/react-paperjs';
import './App.css';
const { Header, Sider, Content } = Layout;
const Shapes = () => <Circle center={[120, 50]} radius={35} fillColor="#00FF00" />;


function App() {
  return (
    <Layout className="me-layout">
      <Header className="me-header">
        ChartInk 0.1
      </Header>
      <Layout>
        <Sider width={48} className="me-left-bar">
          <Sidebar />
        </Sider>
        <Content className="me-canvas">
          <PaperContainer>
            <Circle center={[80, 50]} radius={35} fillColor="red" />
            <Layer>
              <Shapes />
            </Layer>
          </PaperContainer>
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