import React from "react";
import {observable, toJS} from "mobx";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import {Modal} from "antd";
import Dialog from "../common/component/Dialog";
import Ajax from "./Ajax";


class FormDialogState {
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
 * 通用表单对话框，处理了以下逻辑：
 * 1、表单数据获取
 * 2、表单数据验证
 * 3、表单数据提交
 * 4、对话框提交状态设置
 * 5、对话框显示隐藏
 */
@observer
class FormDialog extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        actionURL: PropTypes.any,
        dialogTitle: PropTypes.any,
        onSubmitSuccess: PropTypes.any,
        form: PropTypes.any
    };

    constructor(props) {
        super(props);

        this.state = {

            /**
             * 提交按钮的loading状态
             */
            confirmLoading: false
        };

        /**
         * 弹出框宽度
         */
        this.dialogWidth = 520;

        /**
         * 弹出框标题
         */
        this.dialogTitle = "";

        /**
         * 弹出框确认按钮文字
         */
        this.dialogOkText = "保存";

        /**
         * 弹出框取消按钮文字
         */
        this.dialogCancelText = "取消";

        /**
         * 设置确定、取消按钮是否显示
         */
        this.foot = true;
    }


    /**
     * 提交事件处理
     */
    onOkClick() {

        /**
         * 调用antd的表单组件，验证表单数据
         */
        this.props.form.validateFields((err, values) => {
            if (!err) {
                try {

                    /**
                     * 提交前做预处理
                     */
                    values = this.beforeSubmit(values);

                    /**
                     * 调用提交方法
                     */
                    this.submit(values);
                } catch (e) {
                    Modal.error({
                        title: "提示",
                        content: e,
                        okText: "确定"
                    });
                }

            }
        });
    }

    /**
     * 提交前的逻辑，可由子类重写
     */
    beforeSubmit(values) {
        return values;
    }

    /**
     * 向后台提交数据
     */
    submit(data) {
        if (data !== null && data.relationModelMap !== null) {
            Object.keys(data.relationModelMap || {})
                .forEach((item) => {
                    let relation = data.relationModelMap[item];
                    if (!(relation instanceof Array)) {
                        throw new Error("relationModelMap:" + relation + ",必须为数组");
                    }
                    if (relation.length <= 0) {
                        data.relationModelMap[item] = "null-value";
                    }
                });
        }

        /**
         * 必须设置，作为提交到后台的接口
         */
        if (!this.getActionURL()) {
            throw new Error("请设置FormDialog的actionURL属性");
        }

        /**
         * 设置按钮为loading
         */
        this.ConfirmLoading(true);

        /**
         * 和之前的表单数据合并，有些值不会放到表单里
         */
        data = Object.assign(toJS(this.props.state.data), data);

        /**
         * 提交数据
         */
        Ajax.apiPost(this.getActionURL(), data)
            .then((d) => {

                /**
                 * 服务端返回后，取消按钮的loading状态
                 */
                this.ConfirmLoading(false);

                /**
                 * 关闭对话框
                 */
                this.props.state.hide();

                /**
                 * 调用回调成功的方法
                 */
                this.onSubmitSuccess(d);
            }).catch((msg) => {
                this.ConfirmLoading(false);
                this.onSubmitError(msg);
            });
    }

    /**
     * 设置按钮的loading状态
     */
    ConfirmLoading(isConfirm) {
        this.setState({confirmLoading: isConfirm});
    }

    onCancelClcik() {
        this.props.state.hide();
    }

    /**
     * 提交成功的回调，由子类重写
     */
    onSubmitSuccess(msg) {
        if (this.props.onSubmitSuccess) {
            this.props.onSubmitSuccess(msg);
        }
    }

    /**
     * 提交失败的回调，由子类重写
     */
    onSubmitError(msg) {
        Modal.error({
            title: "提示",
            content: msg,
            okText: "确定"
        });
    }

    /**
     * 表单元素，由子类重写
     */
    renderForm() {
    }

    /**
     * 获取对话框标题
     * 兼容 dialogTitle 和 this.props.dialogTitle
     * 优先选择this.props.dialogTitle
     * @private
     */
    getTitle() {
        if (this.props.dialogTitle) {
            return this.props.dialogTitle;
        } else if (this.dialogTitle) {
            return this.dialogTitle;
        } else {
            return "提示";
        }
    }

    /**
     * 获取请求地址
     * 兼容 actionURL 和 this.props.actionURL
     * 优先选择this.props.actionURL
     * @private
     */
    getActionURL() {
        if (this.props.actionURL) {
            return this.props.actionURL;
        } else if (this.actionURL) {
            return this.actionURL;
        } else {
            return null;
        }
    }

    render() {
        let modal = (<Dialog
            title={this.getTitle()}
            okText={this.dialogOkText}
            cancelText={this.dialogCancelText}
            width={this.dialogWidth}
            style={{top: 20}}
            destroyOnClose
            maskClosable={false}
            visible={this.props.state.visible}
            onOk={() => this.onOkClick()}
            confirmLoading={this.state.confirmLoading}
            onCancel={() => this.onCancelClcik()}
        >

            {
                this.renderForm()
            }

        </Dialog>);
        if (this.foot === false) {
            modal = (<Dialog
                title={this.getTitle()}
                okText={this.dialogOkText}
                cancelText={this.dialogCancelText}
                width={this.dialogWidth}
                style={{top: 20}}
                destroyOnClose
                maskClosable={false}
                visible={this.props.state.visible}
                onOk={() => this.onOkClick()}
                confirmLoading={this.state.confirmLoading}
                onCancel={() => this.onCancelClcik()}
                footer={null}
            >

                {
                    this.renderForm()
                }

            </Dialog>);
        }
        return (
            modal
        );
    }

}

export {FormDialog, FormDialogState};
