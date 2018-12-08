import React from "react";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import Dialog from "../Dialog";
import {observable} from "mobx";

class AppState {
    @observable visible = false;
    @observable confirmLoading = false;
    @observable title = "";
    @observable okText = "确定";
    @observable cancelText = "取消";
    @observable width = 520;
}

@observer
export default class FormDialog extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        onOk: PropTypes.any,
        onCancel: PropTypes.any,
    };

    static newState() {
        return new AppState();
    }

    hideDialog = () => {
        const {state} = this.props;
        state.visible = false;
        state.confirmLoading = false;
    };

    render() {
        const {state,onCancelClick = this.hideDialog, onOkClick = this.hideDialog} = this.props;
        return (
            <Dialog
                style={{top: 20}}
                destroyOnClose={true}
                maskClosable={false}
                width={state.width}
                title={state.title}
                okText={state.okText}
                cancelText={state.cancelText}
                visible={state.visible}
                confirmLoading={state.confirmLoading}
                onOk={onOkClick}
                onCancel={onCancelClick}>

                {
                    this.props.children
                }
            </Dialog>
        )
    }
}