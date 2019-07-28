import * as React from "react";
import ToolBar from "./ToolBar";
import Total from "./Total";
import Content from "./Content";
import BottomBar from "./BottomBar";
import {Flex} from "antd-mobile";
import icons from "@res/icons";
import CacheRouterContainer from "@components/CacheRouterContainer";

export default class Home extends React.Component {
    _bottomIcons = [
        {
            label: "账户",
            url: "asset",
            icon: icons.xe301
        },
        {
            label: "流水",
            url: "list",
            icon: icons.xe302
        },
        {
            label: "统计",
            url: "invest",
            icon: icons.xe303
        },
        {
            label: "设置",
            url: "setting",
            icon: icons.xe304
        },
    ];

    render() {
        return (
            <CacheRouterContainer
                style={{width: "100%", height: "100%"}}
                direction={"column"}
            >
                <ToolBar title={"默认账本"}/>
                <Flex direction={"column"} style={{width:"100%",height:0,flex:1,overflowY:"auto"}}>
                    <Total/>
                    <Content/>
                </Flex>
                <BottomBar data={this._bottomIcons}/>
            </CacheRouterContainer>
        );

    }
}