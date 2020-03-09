import React from "react";
<<<<<<< HEAD
import { Button, Layout, Tooltip, Menu } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import Config from "../Common/Config";
const { Header } = Layout;
const { SubMenu } = Menu;
=======
import {Button, Layout, Tooltip} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";
import {Redo, Undo} from '../Common/UndoAndRedo';

const {Header} = Layout;
>>>>>>> remotes/origin/ZhiliangJia
const IconFont = createFromIconfontCN({
    scriptUrl: Config.IconUrl,
});

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
<<<<<<< HEAD
            <div className="logo">
                <IconFont type="icon--pencil" style={{ fontSize: '32px'}} />
            </div>
            <Menu
                mode="horizontal"
                style={{ lineHeight: '47px' }}
            >
                <SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            File
                         </span>
                    }
                >
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
            </Menu>
            <div className="buttons">
                <Tooltip placement="bottom" title={"undo"}>
                    <Button><IconFont type="icon-undo" /></Button>
                </Tooltip>
                <Tooltip placement="bottom" title={"redo"}>
                    <Button><IconFont type="icon-redo" /></Button>
                </Tooltip>
            </div>

=======
            ChartInk 0.1
            <Tooltip placement="bottom" title={"undo"}>
                <Button onClick={Undo}><IconFont type="icon-undo"/></Button>
            </Tooltip>
            <Tooltip placement="bottom" title={"redo"}>
                <Button onClick={Redo}><IconFont type="icon-redo"/></Button>
            </Tooltip>
>>>>>>> remotes/origin/ZhiliangJia
        </Header>
    )
}

export default HeaderBar;
