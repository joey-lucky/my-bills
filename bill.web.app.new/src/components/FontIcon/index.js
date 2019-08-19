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

    render() {
        let {className="",style={},...restProps} = this.props;
        return (
            <div
                {...restProps}
                className={`${styles.container} ${className}`}
                style={style}
            >
                {he.decode(this.props.unicode)}
            </div>
        );
    }
}