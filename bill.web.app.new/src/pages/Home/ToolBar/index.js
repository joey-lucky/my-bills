import * as React from "react";
import * as styles from "./index.css";
import * as PropTypes from "prop-types";
import FontIcon from "@components/FontIcon";

export default class ToolBar extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    {this.props.title}
                </div>
                <FontIcon
                    className={styles.icon}
                    unicode={"&#xe84e;"}
                />
            </div>
        );

    }
}