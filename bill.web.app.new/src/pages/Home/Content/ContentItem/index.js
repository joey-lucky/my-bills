import * as React from "react";
import * as styles from "./index.css";
import FontIcon from "@components/FontIcon";

export default class ContentItem extends React.Component {

    render() {
        return (
            <div className={styles.container}>
                <div>
                    <div className={styles.leftIcon}>
                        <FontIcon
                            unicode={"&#xe603;"}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.title}>
                            今天
                        </div>
                        <div className={styles.text}>
                            6月10日 - 6月17日
                        </div>
                    </div>
                    <div className={styles.money}>
                        <div>0.00</div>
                        <div>0.00</div>
                    </div>
                    <div className={styles.rightIcon}>
                        <FontIcon
                            unicode={"&#xe84e;"}/>
                    </div>
                </div>
            </div>
        );
    }
}