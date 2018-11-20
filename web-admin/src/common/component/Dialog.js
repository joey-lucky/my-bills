/**
 * 弹出对话框，props跟antd的Modal一样
 *
 * 让对话框不会溢出屏幕，且内容过多的时候，出现滚动条
 */
import * as React from "react";
import * as PropTypes from "prop-types";
import {Modal} from "antd";
import {observer} from "mobx-react";
import {computed} from "mobx";
import ScreenState from "../ScreenState";
import * as styles from "./Dialog.css";

class AppState {
    screenState = new ScreenState();

    @computed
    get maxDialogBodyHeight() {
        // 上下margin各20
        let margin = 40;
        // body有个padding 24
        let padding = 48;
        // 对话框标题栏高度
        let height = 55;
        // 对话框底部按钮高度
        let button = 55;
        return this.screenState.clientHeight - margin - height - button - padding;
    }
}

@observer
export default class Dialog extends React.Component {
    static appState = new AppState();

    static propTypes = {
        children: PropTypes.any
    };

    render() {
        const layout = {style: {top: 20, bottom: 20}, ...this.props};
        layout.children = undefined;
        return (
            <Modal
                {...layout}
            >
                <div
                    className={styles.dialogBody}
                    style={{maxHeight: Dialog.appState.maxDialogBodyHeight}}
                >
                    {this.props.children}
                </div>
            </Modal>
        );
    }
}
