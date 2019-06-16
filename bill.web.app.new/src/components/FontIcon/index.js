import * as React from "react";
import * as styles from "./index.css";
import "./font-icon.less";
import * as PropTypes from "prop-types";
import he from "he";

export default class FontIcon extends React.Component {
    static propTypes = {
        unicode: PropTypes.string.isRequired,
        className:PropTypes.string,
        style:PropTypes.object,
    };

    static icons = {
        toolbar:{
            right: "&#xe311;",
            left: "&#xe312;",
            confirm: "&#xe313;",
            search: "&#xe314;",
            add: "&#xe315;",
        },
        bottomBar:["&#xe301;","&#xe302;","&#xe303;","&#xe304;"],
    };

    render() {
        let {className="",style={}} = this.props;
        return (
            <div
                className={`${styles.container} ${className}`}
                style={style}
            >
                {he.decode(this.props.unicode)}
            </div>
        );
    }
}