import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";


export default class TemplateItem extends React.Component {
    static propTypes = {
        billDesc: PropTypes.string.isRequired,
        cardName: PropTypes.string.isRequired,
        cardUserName: PropTypes.string.isRequired,
        billTypeName: PropTypes.string.isRequired,
    };


    render() {
        let {billDesc, billTypeName, cardUserName, cardName} = this.props;
        let detail = billTypeName + "  " + cardUserName + " · " + cardName;
        return (
            <Flex
                style={styles.container}
                direction={"row"}
                justify={"center"}
            >
                <FontIcon
                    style={styles.cardIcon}
                    unicode={icons.xe401}
                />
                <Flex
                    style={styles.content}
                    direction={"column"}
                >
                    <div style={commonStyles.title}>{billDesc}</div>
                    <div style={styles.detail}>{detail}</div>
                </Flex>
                <FontIcon
                    style={styles.rightIcon}
                    unicode={icons.right}/>
            </Flex>
        );
    }

}
const commonStyles = {
    title: {
        fontSize: "0.41rem",
        color: colors.title
    },
    tooltip: {
        fontSize: "0.27rem",
        color: colors.tooltip
    },
};
const styles = {
    container: {
        width: "100%",
        height: "1.9rem",
        paddingLeft: "0.5rem"
    },
    cardIcon: {
        color: "#EE7F6C",
        fontSize: fontSizes.appBar,
        marginLeft: "0.12rem",
        marginRight: "0.4rem",
    },
    content: {
        width: 0,
        flex: 1,
    },
    detail: {
        ...commonStyles.tooltip,
        marginTop: "0.1rem"
    },
    rightIcon:{
        paddingLeft:"0.34rem",
        paddingRight:"0.51rem",
        color: colors.divider,
        fontSize: fontSizes.text
    },
};