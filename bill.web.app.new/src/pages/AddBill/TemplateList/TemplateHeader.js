import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";


export default class TemplateHeader extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"row"}
                justify={"start"}
            >
                {this.props.name}
            </Flex>
        );
    }

}

const styles = {
    container: {
        width: "100%",
        height: "1.15rem",
        paddingLeft: "0.5rem",
        fontSize: "0.27rem",
        color: colors.tooltip
    },

};