import * as React from "react";
import * as styles from "./index.css";
import * as PropTypes from "prop-types";

export default class ToolBar extends React.Component{
    static propTypes = {
        title: PropTypes.string.isRequired,
    };
    render(){
        return(
            <div className={styles.container}>
                <div className={styles.titleContainer}>{this.props.title}</div>
            </div>
        );

    }
}