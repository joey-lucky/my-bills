import * as React from "react";
import ToolBar from "./ToolBar";
import Total from "./Total";
import Content from "@pages/Home/Content";
import BottomBar from "@pages/Home/BottomBar";
import {Flex} from "antd-mobile";

export default class Home extends React.Component{
    render(){
        return(
            <Flex
                style={{width:"100%",height:"100%"}}
                direction={"column"}
            >
                <ToolBar title={"默认账本"}/>
                <Total/>
                <Content/>
                <BottomBar/>
            </Flex>
        );

    }
}