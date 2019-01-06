import React from "react";
import {observer} from "mobx-react";
import MainList from "./MainList";
import EntList from "./ent/EntList";
import * as styles from "./EntManager.css";

// ent state 设置为全局
export const entListState = EntList.newState();

class AppState {
    mainListState = MainList.newState();
}

@observer
export default class EntManager extends React.Component {
    _appState = new AppState();

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.leftEntList}>
                    <EntList state={entListState}/>
                </div>
                <div className={styles.content}>
                    <MainList state={this._appState.mainListState}/>
                </div>
            </div>
        );
    }
}
