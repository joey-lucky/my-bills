import * as React from "react";
import PropTypes from "prop-types";


export default class CircleSolidText extends React.Component {
    static propTypes = {
        style: PropTypes.object
    };

    render() {
        let {style = {}} = this.props;
        style = {
            display: "flex",
            flexShrink: 0,
            justifyContent: "center",
            alignItems: "center",
            width: "1.5em",
            height: "1.5em",
            borderRadius: "1.5em",
            backgroundColor: "grey",
            fontColor: "#333333",
            ...style
        };
        return (
            <div style={style}>{this.props.children}</div>
        );
    }
}
