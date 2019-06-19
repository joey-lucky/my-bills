import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";

export default class BlankFlex extends React.Component {
    static propTypes = {
        blankDirection: PropTypes.oneOf(["row", "column"]),
        blankLevel: PropTypes.arrayOf(PropTypes.number),
        style: PropTypes.object,
        onClick: PropTypes.func,
        direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
        justify: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
        align: PropTypes.oneOf(['start', 'center', 'end', 'baseline', 'stretch']),
    };

    calculateStyle() {
        let {style = {}, blankDirection = "row", blankLevel = 1} = this.props;
        let paddingStyle;
        let padding = 0.1 * blankLevel + "rem";
        if (blankDirection === "row") {
            paddingStyle = {
                height: "100%",
                paddingLeft: padding,
                paddingRight: padding,
            }
        } else {
            paddingStyle = {
                width: "100%",
                paddingTop: padding,
                paddingBottom: padding,
            }
        }
        return {...paddingStyle, ...style};
    }

    render() {
        let {justify = "center", align = "center", style, ...props} = this.props;
        return (
            <Flex
                {...props}
                style={this.calculateStyle()}
                justify={justify}
                align={align}
            >
                {
                    this.props.children
                }
            </Flex>
        )
    }
}