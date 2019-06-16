import * as React from "react";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import * as PropTypes from "prop-types";
import Text from "@components/Text";
import {colors} from "@global";

export default class BottomIcon extends React.Component {
    static propTypes = {
        title: PropTypes.func,
        unicode: PropTypes.string,
    };

    render() {
        return (
            <Flex
                style={{width: "1.5rem", color: '##3B3C37', height: "100%"}}
                justify={"center"}
                direction={"column"}
            >
                <Text
                    type={"display1"}
                    color={colors.black.title}
                >
                    <FontIcon  unicode={this.props.unicode}/>
                </Text>
                <Text type={"text"} text={this.props.title} color={colors.black.appBar}/>
            </Flex>
        );
    }
}