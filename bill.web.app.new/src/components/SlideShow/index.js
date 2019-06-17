import * as React from "react";
import Text from "@components/Text";
import {Flex} from "antd-mobile";
import Blank from "@components/Blank";
import colors from "@res/colors";
import * as PropTypes from "prop-types";

export default class SlideShow extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        money: PropTypes.string.isRequired,
        label1:PropTypes.string.isRequired,
        label2:PropTypes.string.isRequired,
        value1:PropTypes.string.isRequired,
        value2:PropTypes.string.isRequired,
        text: PropTypes.string,
        style: PropTypes.object,
        color: PropTypes.string,
        children: PropTypes.any,
    };

    render() {
        let {style = {}} = this.props;
        style = {...styles.container, ...style};
        return (
            <Flex
                style={style}
                direction={"column"}
                align={"start"}
                justify={"end"}
            >
                <Text
                    type={"title"}
                    text={this.props.title}
                    color={colors.white7}
                />
                <Text
                    type={"display2"}
                    text={this.props.money}
                    color={colors.white}
                />
                <Flex direction={"row"}>
                    <Text
                        type={"title"}
                        text={this.props.label1}
                        color={colors.white7}
                    />
                    <Blank level={2} direction={"row"}>
                        <Text
                            type={"title"}
                            text={this.props.value1}
                            color={colors.white}
                        />
                    </Blank>
                    <Blank level={2} direction={"row"}>
                        <Text
                            type={"title"}
                            text={"|"}
                            color={colors.white7}
                        />
                    </Blank>
                    <Blank level={2} direction={"row"}>
                        <Text
                            type={"title"}
                            text={this.props.label2}
                            color={colors.white7}
                        />
                    </Blank>
                    <Text
                        type={"title"}
                        text={this.props.value2}
                        color={colors.white}
                    />
                </Flex>
            </Flex>
        );
    }
}

const styles = {
    container: {
        background: `url(${require("./test.jpg")}) no-repeat`,
        backgroundSize: "100% 100%",
        height: "4rem",
        width: "100%",
        paddingBottom: "0.56rem",
        paddingLeft: "0.65rem",
        boxSizing: "border-box"
    }

};