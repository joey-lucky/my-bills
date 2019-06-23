import * as React from "react";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import Text from "@components/Text";
import colors from "@res/colors";
import fontSizes from "@res/fontSizes";
import * as PropTypes from "prop-types";

export default class Card extends React.Component {
    static propTypes = {
        name:PropTypes.string.isRequired,
        balance:PropTypes.number.isRequired,
        userName:PropTypes.string.isRequired,
        onClick:PropTypes.func,
    };

    render() {
        return (
            <Flex
                className={"my-button"}
                style={styles.container}
                direction={"row"}
                align={"center"}
                justify={"start"}
                onClick={this.props.onClick}
            >
                <FontIcon
                    style={styles.cardIcon}
                    unicode={icons.xe401}
                />
                <Flex
                    style={styles.cardName}
                    direction={"column"}
                    align={"start"}
                >
                    <Text
                        type={"title"}
                        text={this.props.name}
                    />
                    <Text
                        type={"tooltip"}
                        text={this.props.userName}
                    />
                </Flex>

                <Text
                    type={"text"}
                    text={this.props.balance+""}
                />
                <FontIcon
                    style={styles.rightIcon}
                    unicode={icons.right}/>
            </Flex>
        );
    }
}


const styles = {
    container: {
        width: "100%",
        height: "1.95rem",
        paddingLeft:"0.54rem"
    },
    cardIcon:{
        color: "#EE7F6C",
        fontSize: fontSizes.appBar,
        marginLeft: "0.12rem",
        marginRight:"0.4rem",
    },
    rightIcon:{
        paddingLeft:"0.34rem",
        paddingRight:"0.51rem",
        color: colors.divider,
        fontSize: fontSizes.text
    },
    cardName: {
        width: 0,
        flex: 1
    }
};