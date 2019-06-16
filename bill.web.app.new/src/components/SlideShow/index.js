import * as React from "react";
import * as styles from "./index.css";

export default class SlideShow extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.monthContainer}>
                    <div>6</div>
                    <div>月·支出</div>
                </div>
                <div className={styles.moneyContainer}>9.00</div>
                <div className={styles.budgetContainer}>
                    <div className={styles.label}>预算</div>
                    <div className={styles.value}>点此设置</div>
                    <div className={styles.divider}>|</div>
                    <div className={styles.label}>本月收入</div>
                    <div className={styles.value}>0.00</div>
                </div>
            </div>
        );
    }
}