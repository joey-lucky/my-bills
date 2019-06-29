import * as React from "react";
import * as PropTypes from "prop-types";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";

export default class Text extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf([
            "display4", "display3", "display2", "display1",
            "appBar", "title", "text", "tooltip"
        ]),
        text: PropTypes.string,
        style: PropTypes.object,
        color: PropTypes.string,
        children: PropTypes.any,
        onClick: PropTypes.func,
    };

    render() {
        let fontSize = fontSizes[this.props.type];
        let color = this.props.color || colors[this.props.type] || colors.text;
        let style = {
            fontSize: fontSize,
            color: color,
            ...(this.props.style || {})
        };
        return (
            <div
                onClick={this.props.onClick}
                style={style}
            >
                {this.props.text}
                {this.props.children}
            </div>
        );
    }
}