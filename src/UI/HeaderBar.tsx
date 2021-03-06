import React from "react";
import {Button, Layout, Tooltip, Menu, Modal} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";
import {Redo, Undo} from '../Common/UndoAndRedo';
import {GridLayout,
    XaxisLayout,
    YaxisLayout,
    XYaxisLayout
} from '../MyCanvas/Layout'
const {Header} = Layout;
const {SubMenu} = Menu;
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

const About = () => {
    //window.alert("开发人员：\n张迪\n贾志亮 罗远明 朱迪琪 金豪南 吴祥敏");
    Modal.info({
        title: '开发人员',
        content: (
            <div>
                <p>张迪 贾志亮 罗远明 朱迪琪 金豪南 吴祥敏 薛雨萌</p>
            </div>
        ),
        onOk() {
        },
    });
}
const HeaderBar = () => {
    // //工具映射函数
    // const FunctionMap = (ToolType: string) => {
    //     //根据类型选择对应的函数
    //     switch (ToolType) {
    //         case 'circle': return ToolDrawCircle;
    //     }
    // }
    return (
        <Header className="me-header">
            <div className="logo">
                <IconFont type="icon--pencil" style={{fontSize: '32px'}}/>
            </div>
            <Menu
                mode="horizontal"
                style={{lineHeight: '47px'}}>
                <SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            File
                         </span>
                    }>
                    <Menu.ItemGroup>
                        <Menu.Item key="1">new</Menu.Item>
                        <Menu.Item key="2">open</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup>
                        <Menu.Item key="3">export SVG</Menu.Item>
                        <Menu.Item key="4">import SVG</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu>
                <Menu.Item key="6">Edit</Menu.Item>
                <Menu.Item key="7">Group</Menu.Item>
                <Menu.Item key="8">scafford</Menu.Item>
                <Menu.Item key="9" onClick={About}>About</Menu.Item>
                <SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                           Layout
                         </span>
                    }>
                    <Menu.ItemGroup>
                        <Menu.Item key="10" onClick={XaxisLayout}>x-axis</Menu.Item>
                        <Menu.Item key="11" onClick={YaxisLayout}>y-axis</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup>
                        <Menu.Item key="12" onClick={XYaxisLayout}>xy-axis</Menu.Item>
                        <Menu.Item key="13" onClick={GridLayout}>GridLayout</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu>
            </Menu>
            <div className="buttons">
                <Tooltip placement="bottom" title={"undo"}>
                    <Button onClick={Undo}><IconFont type="icon-undo"/></Button>
                </Tooltip>
                <Tooltip placement="bottom" title={"redo"}>
                    <Button onClick={Redo}><IconFont type="icon-redo"/></Button>
                </Tooltip>
            </div>
        </Header>
    )
}

export default HeaderBar;
