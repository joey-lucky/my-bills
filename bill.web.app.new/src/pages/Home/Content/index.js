import * as React from "react";
import ContentItem from "./ContentItem";
import {Flex} from "antd-mobile";

export default class Content extends React.Component{

    render(){
        return(
            <Flex.Item
                style={{width:"100%"}}
                direction={"column"}
            >
                <Flex direction={"column"}>
                    <ContentItem/>
                    <ContentItem/>
                    <ContentItem/>
                    <ContentItem/>
                </Flex>
            </Flex.Item>
        );
    }
}