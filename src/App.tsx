//ts中引入的写法
import * as React from "react";
//react中引入的写法
import { Layout } from 'antd';
import SplitPane from 'react-split-pane';
import MyCanvas from "./MyCanvas/MyCanvas";
import SiderBar from "./UI/SiderBar"
import HeaderBar from "./UI/HeaderBar"
import Layer from "./UI/Layers"
import Overview from "./UI/Overview";
import './App.css';
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "./Common/Config";
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

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
              <div>
                  <Overview></Overview>
              </div>
              <div>
                  <div className='layer-controls'>
                      <div className='layer-controls-left'>
                          <div className='layer-controls-box'>
                              <IconFont className='layer-controls-icon' type="icon-add"/>
                          </div>
                          <div className='layer-controls-box'>
                              <IconFont className='layer-controls-icon' type="icon-delete"/>
                          </div>
                      </div>
                      <div className='layer-controls-right'></div>
                  </div>
                <Layer></Layer>
              </div>
            </SplitPane>
          </Content>
      </Layout>
    </Layout>

  );
}

export default App;
