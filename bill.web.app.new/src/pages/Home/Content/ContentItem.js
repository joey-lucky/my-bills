import * as React from "react";
import FontIcon from "@components/FontIcon";
import Text from "@components/Text";
import {Flex} from "antd-mobile";
import Blank from "@components/Blank";
import * as PropTypes from "prop-types";
import colors from "@res/colors";
import icons from "@res/icons";

export default class ContentItem extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        title: PropTypes.string,
        dateText: PropTypes.string,
        income: PropTypes.string,
        outgoing: PropTypes.string,
    };

    render() {
        return (
            <Flex
                style={{height: "2.16rem", width: "100%"}}
                direction={"row"}
                onClick={this.props.onClick}
            >
                <Blank level={2} direction={"row"}/>
                <Flex
                    style={{width: 0, flex: "1", height: "100%", borderBottom: "#E9E9E9 1px solid"}}
                    direction={"row"}
                >
                    <Blank level={1} direction={"row"}/>
                    <Text
                        type={"display1"}
                        color={colors.income}
                    >
                        <FontIcon unicode={"&#xe321;"}/>
                    </Text>
                    <Blank level={2} direction={"row"}/>
                    <Flex
                        style={{flex: 1, width: 0}}
                        direction={"column"}
                        align={"start"}
                    >
                        <Text type={"title"} text={this.props.title}/>
                        <Blank level={1} direction={"column"}/>
                        <Text type={"tooltip"} text={this.props.dateText}/>
                    </Flex>
                    <Blank level={2} direction={"row"}/>
                    <Flex
                        style={{fontWeight: "600"}}
                        direction={"column"}
                    >
                        <Text
                            color={colors.income}
                            type={"text"}
                            text={this.props.income}
                        />
                        <Blank level={1} direction={"column"}/>
                        <Text
                            color={colors.outgoing}
                            type={"text"}
                            text={this.props.outgoing}
                        />
                    </Flex>
                    <Blank level={2} direction={"row"}/>
                    <Text type={"text"}>
                        <FontIcon unicode={icons.right}/>
                    </Text>
                    <Blank level={2} direction={"row"}/>
                </Flex>
            </Flex>
        );
    }
}