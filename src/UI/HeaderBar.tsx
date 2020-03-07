import React from "react";
import {Button, Layout, Tooltip} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import Config from "../Common/Config";
import {Redo, Undo} from '../Common/UndoAndRedo';

const {Header} = Layout;
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
            ChartInk 0.1
            <Tooltip placement="bottom" title={"undo"}>
                <Button onClick={Undo}><IconFont type="icon-undo"/></Button>
            </Tooltip>
            <Tooltip placement="bottom" title={"redo"}>
                <Button onClick={Redo}><IconFont type="icon-redo"/></Button>
            </Tooltip>
        </Header>
    )
}

export default HeaderBar;
