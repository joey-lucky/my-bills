import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import Total from "@pages/Home/Total";
import * as PropTypes from "prop-types";
import SlideShow from "@components/SlideShow";
import MonthItem from "@pages/List/MonthItem";


export default class List extends React.Component{

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
                    title={"流水"}
                    showAdd={true}
                    showSearch={true}
                    onAddClick={this.onAddClick}
                />
                <SlideShow
                    title={"净资产"}
                    money={"10000"}
                    label1={"资产"}
                    value1={"20000"}
                    label2={"负债"}
                    value2={"10000"}
                />
                <MonthItem income={10000} outgoing={5000} date={new Date()} defaultExpand={false}/>
            </Flex>
        );

    }
}