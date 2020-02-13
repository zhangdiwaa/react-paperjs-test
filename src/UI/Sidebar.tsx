//ts中引入的写法
import * as React from "react";
import { Button, Icon } from 'antd';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1638575_i23xlb5oazk.js',
});

export default class Sidebar extends React.Component{
    render(){
        return (
            <div>
                <Button type="primary" shape="circle"><IconFont type="icon-pen" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Line" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Select-1" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Select-" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-hand" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Text-box" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-zoom" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-hand" /></Button>
                <Button type="primary" shape="circle"><IconFont type="icon-Link-Select" /></Button>
            </div>
        );
    };
}
