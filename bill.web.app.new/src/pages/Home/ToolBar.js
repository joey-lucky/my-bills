import * as React from "react";
import * as PropTypes from "prop-types";
import FontIcon from "@components/FontIcon";
import Text from "@components/Text";
import {Flex} from "antd-mobile";
import Blank from "@components/Blank";


export default class ToolBar extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Flex
                style={{height:"1.8rem",width:"100%"}}
                direction={"row"}
                align={"center"}
            >
                <Blank level={2} direction={"row"}/>
                <Text
                    text={this.props.title}
                    type={"appBar"}
                />
                <Blank level={1} direction={"row"}/>
                <FontIcon
                    style={{fontSize:"0.35rem"}}
                    unicode={FontIcon.icons.toolbar.right}
                />
            </Flex>
        );

    }
}