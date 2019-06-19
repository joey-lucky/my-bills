import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import CardTypeItem from "@pages/Assert/CardTypeItem";
import {Divider} from "@components/Divider";


export default class Assert extends React.Component{

    onAddClick = (event) => {
        event.stopPropagation();
    };

    render(){
        return(
            <Flex
                style={{width:"100%",height:"100%"}}
                direction={"column"}
            >
                <ToolBar
                    title={"账户"}
                    showAdd={true}
                    onAddClick={this.onAddClick}
                />
                <SlideShow
                    title={"净资产"}
                    money={"109.69"}
                    label1={"资产"}
                    value1={"7700.65"}
                    label2={"负债"}
                    value2={"109.65"}
                />
                <CardTypeItem/>
                <Divider direction={"row"} size={"0.12rem"}/>
                <CardTypeItem/>
                <Divider direction={"row"} size={"0.12rem"}/>
                <CardTypeItem/>
                <Divider direction={"row"} size={"0.12rem"}/>
                <CardTypeItem/>
            </Flex>
        );

    }
}