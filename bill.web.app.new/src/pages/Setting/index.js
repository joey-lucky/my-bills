import * as React from "react";
import ToolBar from "@components/ToolBar";
import SettingItem from "@pages/Setting/SettingItem";
import * as styles from "./index.css";

export default class Setting extends React.Component {

    onAddClick = (event) => {
        event.stopPropagation();
    };

    render() {
        return (
            <div
                className={styles.container}
            >
                <ToolBar
                    title={"设置"}
                    showAdd={true}
                    onAddClick={this.onAddClick}
                />
                <div className={styles.content}>
                    <SettingItem
                        label={"账单类型"}
                        onClick={() => {
                            this.props.history.push(this.props.match.path + "/bill-type-list");
                        }}
                    />
                    <SettingItem label={"其它"}/>
                </div>
            </div>
        );

    }
}