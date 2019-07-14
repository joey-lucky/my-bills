import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";


export default class TemplateItem extends React.Component {
    static propTypes = {
        data: PropTypes.shape({
            billDesc: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            cardName: PropTypes.string.isRequired,
            cardUserName: PropTypes.string.isRequired,
            billTypeName: PropTypes.string.isRequired,
            billTypeTypeName: PropTypes.string.isRequired,
            targetCardName: PropTypes.string,
        }),
        onClick: PropTypes.func.isRequired,
    };

    render() {
        let {billDesc, name,billTypeName, cardUserName,targetCardName, cardName,billTypeTypeName} = this.props.data;
        let detail = cardUserName + "  ·  " + cardName;
        if (targetCardName) {
            detail += "-" + targetCardName;
        }
        return (
            <Flex
                style={styles.container}
                direction={"row"}
                justify={"center"}
                onClick={this.props.onClick}
            >
                <FontIcon
                    style={{...styles.cardIcon,color:colors.getMoneyColor(billTypeTypeName)}}
                    unicode={icons.xe401}
                />
                <Flex
                    style={styles.content}
                    direction={"column"}
                    align={"start"}
                >
                    <div style={commonStyles.title}>{name}</div>
                    <div style={styles.detail}>{billTypeName}</div>
                    <div style={styles.detail}>{detail}</div>
                </Flex>
                <div style={styles.detail}>{billDesc}</div>
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
        height: "2.1rem",
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