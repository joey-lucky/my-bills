import React from "react";
import {observable, toJS, action} from "mobx";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import Assert from "@utils/Assert";
import {Form, Modal} from "antd";
import {Ajax} from "@utils/ajax";
import FormUtils from "@utils/FormUtils";
import Dialog from "./Dialog";

function checkRelationDataType(data) {
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
}

@observer
export default class FormDialog extends React.Component {
    static propTypes = {
        // 请求
        actionURL: PropTypes.string.isRequired,
        onFinish: PropTypes.func,
        onFinishFailed: PropTypes.func,

        // Dialog 属性
        okText: PropTypes.node,
        cancelText: PropTypes.node,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.node,

        // Form
        labelCol: PropTypes.object,
        wrapperCol: PropTypes.object,
        layout: PropTypes.string,
        children: PropTypes.node,
    };

    static defaultProps = {
        title: "提示",
        width: 520,
        okText: "确定",
        cancelText: "取消",
        actionURL: "",
        labelCol: null,
        wrapperCol: null,
        layout: null,
        children: null,
    };

    @observable appState = {
        visible: false,
        confirmLoading: false,
        data: {}
    };

    formRef = React.createRef();

    onOkClick = async () => {
        const {onFinish, onFinishFailed, actionURL} = this.props;
        //不捕捉异常，托管给Form页面捕捉
        this.formRef.current.validateFields().then(async (values) => {
            this.showConfirmLoading();
            try {
                Assert.hasText(actionURL, "actionURL 为空");
                values = {...values};
                values = this.beforeSubmit(values);
                values = FormUtils.trimAroundSpace(values);
                checkRelationDataType(values);
                values = Object.assign(toJS(this.appState.data), values);
                let d = await Ajax.apiPost(actionURL, values);
                this.hideConfirmLoading();
                this.hide();
                if (d.result_flag_dsc) {
                    Modal.success({
                        title: "提示",
                        content: d.result_flag_dsc,
                        okText: "确定"
                    });
                }
                onFinish && onFinish(d);
            } catch (e) {
                this.hideConfirmLoading();
                Modal.error({
                    title: "提示",
                    content: e.message,
                    okText: "确定"
                });
                onFinishFailed && onFinishFailed(e);
            }
        });
    };

    onCancelClick = () => {
        this.hide();
    };

    @action showConfirmLoading() {
        this.appState.confirmLoading = true;
    }

    @action hideConfirmLoading() {
        this.appState.confirmLoading = false;
    }

    @action show(data = {}) {
        this.appState.visible = true;
        this.appState.data = data;
    }

    @action hide() {
        this.appState.visible = false;
        this.appState.data = {};
    }

    beforeSubmit(values) {
        return values;
    }

    getInitialValues(values) {
        return values;
    }

    renderForm() {
        return null;
    }

    render() {
        console.log(this.constructor.name, "render");
        const {
            title = "提示",
            okText = "确定",
            cancelText = "取消",
            width = 520,
        } = toJS(this.props);
        const {visible, confirmLoading, data} = toJS(this.appState);
        const {labelCol, wrapperCol, layout, children = null} = this.props;
        return (
            <Dialog
                visible={visible}
                title={title}
                width={width}
                maskClosable={false}
                destroyOnClos={true}
                confirmLoading={confirmLoading}
                okText={okText}
                cancelText={cancelText}
                onOk={this.onOkClick}
                onCancel={this.onCancelClick}
                footer={undefined}
            >
                <Form
                    ref={this.formRef}
                    initialValues={this.getInitialValues(data)}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    layout={layout}
                >
                    {this.renderForm()}
                    {children}
                </Form>
            </Dialog>
        );
    }
}
