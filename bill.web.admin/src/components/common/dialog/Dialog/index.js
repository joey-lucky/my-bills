import * as React from "react";
import * as PropTypes from "prop-types";
import {Modal} from "antd";
import {observer} from "mobx-react";
import {computed} from "mobx";
import ScreenState from "@utils/ScreenState";
import * as styles from "./index.module.css";

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
        children: PropTypes.any,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        okText: PropTypes.node,
        cancelText: PropTypes.node,
        centered: PropTypes.bool,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        confirmLoading: PropTypes.bool,
        visible: PropTypes.bool,
        align: PropTypes.object,
        footer: PropTypes.node,
        title: PropTypes.node,
        closable: PropTypes.bool,
        maskClosable: PropTypes.bool,
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

