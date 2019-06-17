import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import Total from "@pages/Home/Total";
import * as PropTypes from "prop-types";


export default class Invest extends React.Component{

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
                    title={"投资"}
                    showAdd={true}
                    onAddClick={this.onAddClick}
                />
                <Total/>
            </Flex>
        );

    }
}