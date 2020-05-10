import React, { useState,Component } from 'react';
import { Modal, Button,Input} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import Config from "../Common/Config";
import EventHub from "../Common/Observer";
import {RemoveTool} from "./PaperTools";
import * as paper from "paper";

const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});
const pageChange = {
    pageChangeBefore: () => {
        EventHub.emit('pageChangeBefore', null)
    },
    pageChangeAfter: () => {
        EventHub.emit('pageChangeAfter', null)
    }
}
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
        this.PointText();
    };
    /**
     * 取消按钮鼠标事件
     */
    PointText = () =>{
        /**
         * 嵌入实现打字效果的函数
         */
        RemoveTool()
        let tool: paper.Tool = new paper.Tool()
        tool.onMouseDown = (event: paper.ToolEvent) => {
            pageChange.pageChangeBefore()
            let text: paper.PointText = new paper.PointText({
                point: event.downPoint,
                content: this.state.InputText,
                fillColor: 'black',
                fontFamily: 'Courier New',
                fontWeight: 'bold',
                fontSize: 25,
                name: 'Text'
            });
            text.onDoubleClick = () =>{
                this.setState({
                    visible: true,
                })
                text.onClick = () =>{
                    text.content = this.state.InputText
                }
            }
        }
        tool.onMouseUp = (event: paper.ToolEvent) => {
            pageChange.pageChangeAfter()
        }
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };
    onKeyup = (e) =>{
        if(e.keyCode === 13) {
            this.handleOk()
        }
    }
    render() {
        const { visible, confirmLoading} = this.state;
        return (
            <div>
                <Button  onClick={this. showModal}><IconFont type="icon-text" />
                </Button>
                <Modal
                    title="Input You Text"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Input
                        size="small"
                        value={this.state.InputText}
                        onChange ={this.handelChange.bind(this)}
                        onKeyUp={this.onKeyup}
                    >
                    </Input>
                </Modal>
            </div>
        );
    }
}
export default App;
