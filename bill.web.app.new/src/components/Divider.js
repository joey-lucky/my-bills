import * as React from "react";
import * as PropTypes from "prop-types";
import colors from "@res/colors";

export class Divider extends React.Component {
    static propTypes = {
        direction: PropTypes.oneOf(["row", "column"]),
        style: PropTypes.object,
        size: PropTypes.string,
        color: PropTypes.string,
    };

    calculateStyle() {
        let {style = {}, direction = "row", size = "1px", color = colors.divider} = this.props;
        let myStyle ;
        if (direction === "row") {
            myStyle = {
                height: size,
                width: "100%",
                backgroundColor:color
            }
        } else {
            myStyle = {
                width: size,
                height: "100%",
                backgroundColor:color
            }
        }
        return {...myStyle, ...style};
    }

    render() {
        return <div style={this.calculateStyle()}/>
    }

}