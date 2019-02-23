import * as React from "react";
import {Flex} from "antd-mobile";
import {globalStyles} from "@global";

export default class Stat extends React.Component {
    render() {
        return (
            <Flex
                style={globalStyles.container}
                direction={"column"}
                justify={"center"}
                align={"center"}>
                {"待开发"}
            </Flex>
        )
    }
}
