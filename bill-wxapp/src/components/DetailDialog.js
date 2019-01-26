import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Modal} from "antd";
import * as PropTypes from "prop-types";

class DetailDialogState {
    @observable visible = false;

    /**
     * 表单数据，表单数据必须设置到该属性上。
     * 后续表单数据处理提交，都会依赖该对象
     */
    @observable data = {};

    /**
     * 显示对话框
     */
    show() {
        this.visible = true;
    }

    /**
     * 隐藏对话框
     */
    hide() {
        this.visible = false;
    }
}

/**
 * 通用详情对话框
 */
@observer
class DetailDialog extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };
    constructor(props) {
        super(props);

        /**
         * 弹出框宽度
         */
        this.dialogWidth = 520;
        this.title = "详情";
    }

    onCancel() {
        this.props.state.hide();
    }

    /**
     * 表单元素，由子类重写
     */
    renderDetail() {
    }

    render() {

        return (
            <Modal
                title={this.title}
                onCancel={() => this.onCancel()}
                footer={null}
                width={this.dialogWidth}
                destroyOnClose
                visible={this.props.state.visible}
            >
                {
                    this.renderDetail()
                }

            </Modal>
        );
    }
}

export {DetailDialog, DetailDialogState};
