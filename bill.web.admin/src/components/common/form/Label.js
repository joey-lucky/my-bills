import * as React from "react";
import PropTypes from "prop-types";
import * as styles from "./Label.css";

export default class Label extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        text: PropTypes.node,
        colon: PropTypes.bool,
        children: PropTypes.any,
    };

    render() {
        return (
            <span
                className={`${styles.container} ${this.props.className || ""}`}
                {...this.props}
            >
                {
                    this.props.text || ""
                }
                {
                    this.props.colon &&
                    <span className={styles.colon}>:</span>
                }


                {
                    this.props.children
                }
            </span>
        );
    }
}
