import * as React from "react";
import * as PropTypes from "prop-types";
import {colors, fontSizes} from "@global";

export default class Text extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf([
            "display4", "display3", "display2", "display1",
            "appBar", "title", "text", "tooltip"
        ]),
        text: PropTypes.string,
        style: PropTypes.object,
        color:PropTypes.string,
        children: PropTypes.any,
    };

    render() {
        let fontSize = fontSizes[this.props.type];
        let color = this.props.color || colors.black[this.props.type] || colors.black.text;
        let style = {
            fontSize: fontSize,
            color: color,
            ...(this.props.style || {})
        };
        return (
            <div
                style={style}
            >
                {this.props.text}
                {this.props.children}
            </div>
        );
    }
}