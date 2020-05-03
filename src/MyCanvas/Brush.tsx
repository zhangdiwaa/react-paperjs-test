import React, {Component} from 'react';
import {Button, Radio, Popover} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";
import {Clouds, DrippingBrush, MultiLines, ToolFreePen} from './PaperTools';

const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

class App extends Component {
    state = {
        choose_type: 0
    };
    /**
     * 读取Radio中的值，传给choose_type
     */
    handelChange = (e) => {
        console.log('radio checked ', e.target.value);
        this.Brush(e.target.value);
        this.setState({
            choose_type: e.target.value
        });
        console.log(this.state.choose_type)
    };

    /**
     *
     */
    Brush = (n) => {
        if (n === 1) {
            ToolFreePen();
        } else if (n === 2) {
            Clouds();
        } else if (n === 3) {
            MultiLines();
        } else if (n === 4) {
            DrippingBrush();
        }
    };

    onclick=()=>{
        if(this.state.choose_type){
            this.Brush(this.state.choose_type)
        }
    }
    render() {
        return (
            <Popover placement="rightTop" title={"Brush"} content={
                <Radio.Group onChange={this.handelChange} value={this.state.choose_type}>
                    <Radio style={radioStyle} value={1}>Solid Line</Radio>
                    <Radio style={radioStyle} value={2}>Clouds</Radio>
                    <Radio style={radioStyle} value={3}>MultiLines</Radio>
                    <Radio style={radioStyle} value={4}>Dripping Brush</Radio>
                </Radio.Group>
            } trigger="click">
                <Button onClick={this.onclick}><IconFont type="icon-pen"/>
                </Button>
            </Popover>
        );
    }
}

export default App;
