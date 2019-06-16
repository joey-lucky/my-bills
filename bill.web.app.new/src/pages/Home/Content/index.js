import * as React from "react";
import ContentItem from "./ContentItem";
import {Flex} from "antd-mobile";

export default class Content extends React.Component{

    render(){
        return(
            <Flex
                style={{width:"100%",height:0,flex:1,boxShadow:"0px -0.07rem #F5F5F5 inset"}}
                direction={"column"}
            >
                <ContentItem onClick={()=>{}}/>
                <ContentItem/>
                <ContentItem/>
                <ContentItem/>
            </Flex>
        );
    }
}