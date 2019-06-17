import * as React from "react";
import ToolBar from "./ToolBar";
import Total from "./Total";
import Content from "./Content";
import BottomBar from "./BottomBar";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";

export default class Home extends React.Component {
    _bottomIcons = [
        {
            label: "账户",
            url: "asset",
            icon: FontIcon.icons.xe301
        },
        {
            label: "流水",
            url: "list",
            icon: FontIcon.icons.xe302
        },
        {
            label: "投资",
            url: "invest",
            icon: FontIcon.icons.xe303
        },
        {
            label: "设置",
            url: "setting",
            icon: FontIcon.icons.xe304
        },
    ];

    render() {
        return (
            <Flex
                style={{width: "100%", height: "100%"}}
                direction={"column"}
            >
                <ToolBar title={"默认账本"}/>
                <Total/>
                <Content/>
                <BottomBar data={this._bottomIcons}/>
            </Flex>
        );

    }
}