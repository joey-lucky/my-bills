import Dialog from "@components/common/Dialog/Dialog";
import React from "react";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";

/**
 * visible 是个observable 其它属性跟Modal完全一致
 */
@observer
export default class ObservableDialog extends Dialog {
    static propTypes = {
        visible: PropTypes.shape({
            value: PropTypes.bool.isRequired
        }).isRequired,
        title: PropTypes.string.isRequired
    };

    onOk = () => {
        this.props.visible.value = false;
        this.props.onOk && this.props.onOk();
    };
    onCancel = () => {
        this.props.visible.value = false;
        this.props.onCancel && this.props.onCancel();
    };

    render() {
        let {visible, destroyOnClose = true, maskClosable = false, ...props} = this.props;
        let otherProps = {...props};
        delete otherProps.onOk;
        delete otherProps.onCancel;
        return (
            <Dialog
                {...props}
                okText={"确定"}
                destroyOnClose={destroyOnClose}
                maskClosable={maskClosable}
                visible={visible.value}
                onOk={this.onOk}
                onCancel={this.onCancel}
            >
                {this.props.children}
            </Dialog>
        );
    }
}
