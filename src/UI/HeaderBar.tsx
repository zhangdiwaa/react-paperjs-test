import React from "react";
import { Button, Layout, Tooltip, Menu } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import Config from "../Common/Config";
const { Header } = Layout;
const { SubMenu } = Menu;
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

        </Header>
    )
}

export default HeaderBar;