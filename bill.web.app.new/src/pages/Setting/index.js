import * as React from "react";
import ToolBar from "@components/ToolBar";
import Total from "@pages/Home/Total";
import CacheRouterContainer from "@components/CacheRouterContainer";

export default class Setting extends React.Component{

    onAddClick = (event) => {
        event.stopPropagation();
    };

    render(){
        return(
            <CacheRouterContainer
                style={{width:"100%",height:"100%"}}
                direction={"column"}
            >
                <ToolBar
                    title={"设置"}
                    showAdd={true}
                    onAddClick={this.onAddClick}
                />
                <Total/>
            </CacheRouterContainer>
        );

    }
}