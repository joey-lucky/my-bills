import * as React from "react";
import * as styles from "./detail.css";

export default class DetailUtils {
    static getTableLayout = ({title}) => {
        let layout = {
            size: "small",
            pagination: false,
            bordered: "small",
            className: styles.table
        };
        if (title) {
            layout.title = () => <div className={styles.tableTitle}>{title}</div>;
        }
        return layout;
    };

}

