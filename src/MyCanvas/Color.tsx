import React, { Component } from 'react';
import { Button, Popover, Row, Col, Slider, InputNumber} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1764899_r5j3hzvw73.js',
});
class App extends Component {
    state = {
        r:0,
        g:0,
        b:0
    };
    changeR = value =>{
        this.setState({
            r:value
        })
        this.color()
    }
    changeG = value =>{
        this.setState({
            g:value
        })
        this.color()
    }
    changeB = value =>{
        this.setState({
            b:value
        })
        this.color()
    }
    color=()=>{
        let t=document.getElementById('block_color');
        t.style.background='rgba('+this.state.r+','+this.state.g+','+this.state.b+')';
    }
    render() {
        return (
            <Popover placement="rightTop" title={"brush"}
            content={
                <div><div id={'block_color'} style={{width: '200px', height: '200px', background: 'black'}}/>
                <Row>
                <Col span={3}>R</Col>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={255}
                    onChange={this.changeR}
                    value={this.state.r}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    max={255}
                    style={{ width:'60px' }}
                    value={this.state.r}
                    onChange={this.changeR}
                  />
                </Col>
                </Row>
                <Row>
                <Col span={3}>G</Col>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={255}
                    onChange={this.changeG}
                    value={this.state.g}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    max={255}
                    style={{ width:'60px' }}
                    value={this.state.g}
                    onChange={this.changeG}
                  />
                </Col>
                </Row>
                <Row>
                <Col span={3}>B</Col>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={255}
                    onChange={this.changeB}
                    value={this.state.b}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    max={255}
                    style={{ width:'60px' }}
                    value={this.state.b}
                    onChange={this.changeB}
                  />
                </Col>
                </Row>
                </div>
            } trigger="hover">
            <Button><IconFont type="icon-yanse" />
            </Button>
            </Popover>
        );
    }
}
export default App;
