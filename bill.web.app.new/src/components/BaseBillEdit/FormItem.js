import * as React from "react";
import {Flex} from "antd-mobile";
import {Divider} from "@components/Divider";
import FontIcon from "@components/FontIcon";
import fontSizes from "@res/fontSizes";
import BlankFlex from "@components/BlankFlex";
import Text from "@components/Text";
import * as PropTypes from "prop-types";


export default class FormItem extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        color: PropTypes.string,
        onClick: PropTypes.func,
    };

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"column"}
                onClick={this.props.onClick}
            >
                <Flex
                    style={styles.contentContainer}
                    direction={"row"}
                >
                    <FontIcon
                        style={{color: this.props.color, fontSize: fontSizes.appBar}}
                        unicode={this.props.icon}
                    />
                    <BlankFlex blankLevel={1} blankDirection={"row"}/>
                    <Text type={"text"} text={this.props.label}/>
                    <BlankFlex blankLevel={2} blankDirection={"row"}/>
                    <Flex
                        align={"center"}
                        style={styles.childrenContainer}>
                        {
                            this.props.children
                        }
                    </Flex>
                </Flex>
                <Divider direction={"row"}/>
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "1.6rem",
    },
    contentContainer: {
        width: "100%",
        height: 0,
        flex: 1,
    },
    childrenContainer: {
        width: 0,
        height: "100%",
        flex: 1
    }
};