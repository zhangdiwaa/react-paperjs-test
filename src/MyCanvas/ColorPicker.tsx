import React, {Component} from 'react';
import {Button, Popover} from 'antd';
import {ChromePicker} from 'react-color'

class App extends Component {
    state = {
        visible: false,
        confirmLoading: false,
        color: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        }
    }
    handleChangeComplete = (color) => {
        this.setState({
            color: color.rgb
        });
    };

    render() {
        return (
            <Popover placement="rightTop" title={"Brush"} content={
                <ChromePicker
                    color={`rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`}
                    onChangeComplete={this.handleChangeComplete}
                />
            } trigger="hover">
                <Button style={{
                    width: 32,
                    background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`
                }}/>
            </Popover>
        );
    }
}

export default App;
