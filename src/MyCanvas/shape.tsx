import React, {Component} from 'react';
import {Button, Radio, Popover} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import {
    ToolDrawCircle,
    ToolDrawRect,
    ToolDrawSegment
} from "./PaperTools"

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1764899_r5j3hzvw73.js',
});
let color = 'black'

class App extends Component {
    state = {
        choose_type: 0,

    };
    /**
     * 读取Radio中的值，传给choose_type
     */
    handelChange = (e) => {
        this.setState({
            choose_type: e.target.value
        })
        if (e.target.value === 1) {
            ToolDrawSegment(color);
        } else if (e.target.value === 2) {
            ToolDrawCircle(color);
        } else {
            ToolDrawRect(color);
        }
    }

    render() {
        return (
            <Popover placement="rightTop" title={"Shape"} content={
                <Radio.Group onChange={this.handelChange} value={this.state.choose_type}>
                    <Radio value={1}>line</Radio>
                    <Radio value={2}>circle</Radio>
                    <Radio value={3}>rectangle</Radio>
                </Radio.Group>
            } trigger="hover">
                <Button><IconFont type="icon-duobianxing"/>
                </Button>
            </Popover>
        );
    }
}

export default App;
