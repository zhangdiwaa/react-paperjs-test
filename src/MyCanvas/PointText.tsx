import React, { useState,Component } from 'react';
import { Modal, Button,Input} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import Config from "../Common/Config";
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});
const { TextArea } = Input;

class App extends Component {
    state = {
        visible: false,
        confirmLoading: false,
        InputText: '',
      };
    /**
     * 设置Modal弹出属性
     */
      showModal = () => {
        this.setState({
          visible: true,
        });
      };
     /**
       * 读取input中的值，传给InputText
       */
    handelChange = (e) =>{
      this.setState({
        InputText:e.target.value
      })
  }
  /**
   * OK按钮鼠标事件
   */
      handleOk = () => {
        this.setState({    
          confirmLoading: true,
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
        });
        /**
         * 嵌入实现打字效果的函数
         */
        let tool: paper.Tool = new paper.Tool()
        tool.onMouseDown = (event: paper.ToolEvent) => {
            let text: paper.PointText = new paper.PointText({
                point: event.downPoint,
                content: this.state.InputText,
                fillColor: 'black',
                fontFamily: 'Courier New',
                fontWeight: 'bold',
                fontSize: 25
            });
        }        
      };
      /**
       * 取消按钮鼠标事件
       */
      handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
          visible: false,
        });
      };
      render() {
        const { visible, confirmLoading} = this.state;
        return (
          <div>
            <Button  onClick={this.showModal}><IconFont type="icon-text" />
            </Button>
            <Modal
              title="Input You Text"
              visible={visible}
              onOk={this.handleOk}           
              confirmLoading={confirmLoading}
              onCancel={this.handleCancel}
            >
              <div>
                <Input value={this.state.InputText} 
                onChange ={this.handelChange.bind(this)}>
                  </Input>
                  </div>
            </Modal>
          </div>
        );
      }  
      
}
export default App;