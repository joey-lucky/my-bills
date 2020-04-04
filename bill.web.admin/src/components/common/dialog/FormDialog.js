import React from "react";
import {observable, toJS, action} from "mobx";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import Assert from "@utils/Assert";
import {Form, Modal} from "antd";
import {Ajax} from "@utils/ajax";
import FormUtils from "@utils/FormUtils";
import Dialog from "./Dialog/index";

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

let formNameIndex = 0;

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

        successMessage: PropTypes.string,
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
    };

    formRef = React.createRef();
    formName = "FormDialog" + (++formNameIndex);
    record = {};

    getFieldValue(name) {
        this.formRef.current && this.formRef.current.getFieldValue(name);
    }

    getFieldsValue(nameList, filterFunc) {
        this.formRef.current && this.formRef.current.getFieldsValue(nameList, filterFunc);
    }

    // return array
    getFieldError(name) {
        this.formRef.current && this.formRef.current.getFieldError(name);
    }

    // return array
    getFieldsError(nameList) {
        this.formRef.current && this.formRef.current.getFieldsError(nameList);
    }

    resetFields(fields) {
        this.formRef.current && this.formRef.current.resetFields(fields);
    }

    // {name,value}[]
    setFields(fieldDataList) {
        this.formRef.current && this.formRef.current.setFields(fieldDataList);
    }

    setFieldsValue(values) {
        this.formRef.current && this.formRef.current.setFieldsValue(values);
    }

    validateFields(func) {
        this.formRef.current && this.formRef.current.validateFields(func);
    }

    submit() {
        this.formRef.current && this.formRef.current.submit();
    }

    onOkClick = async () => {
        const {onFinish, onFinishFailed, actionURL, successMessage} = this.props;
        //不捕捉异常，托管给Form页面捕捉
        this.formRef.current.validateFields().then(async (values) => {
            this.showConfirmLoading();
            try {
                Assert.hasText(actionURL, "actionURL 为空");
                values = {...values};
                values = Object.assign({}, this.record, values);
                values = this.beforeSubmit(values);
                values = FormUtils.trimAroundSpace(values);
                checkRelationDataType(values);
                let d = await Ajax.apiPost(actionURL, values);
                this.hideConfirmLoading();
                this.hide();
                if (d.result_flag_dsc) {
                    Modal.success({
                        title: "提示",
                        content: successMessage || d.result_flag_dsc,
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
        this.record = this.beforeShow(toJS(data));
        this.appState.visible = true;
        this.resetFields();
        this.setFieldsValue(this.record);//将数据填充到表单
        this.afterShow(this.record);
    }

    @action hide() {
        this.appState.visible = false;
    }

    /**
     * 数据结构转换：表单数据转model,返回model
     */
    beforeSubmit(values) {
        return values;
    }

    /**
     * 数据结构转换：model转表单数据，也可以用于默认值设置,返回表单数据
     */
    beforeShow(data = {}) {
        return data;
    }

    /**
     * 异步操作，比如异步调用get-model方法
     */
    afterShow(data = {}) {

    }

    /**
     * 处理表单之间的交互，比如下拉框A会影响下拉框B的选项等
     */
    onFieldsChange(changedFields, allFields) {

    };

    /**
     * 处理表单之间的交互，比如下拉框A会影响下拉框B的选项等
     */
    onValuesChange(changedValues, allValues) {

    };

    renderForm() {
        return null;
    }

    render() {
        const {
            title = "提示",
            okText = "确定",
            cancelText = "取消",
            width = 520,
        } = toJS(this.props);
        const {visible, confirmLoading} = toJS(this.appState);
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
                forceRender={false}
            >
                <Form
                    name={this.formName}
                    ref={this.formRef}
                    initialValues={this.record}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    layout={layout}
                    onFieldsChange={(...args) => this.onFieldsChange(...args)}
                    onValuesChange={(...args) => this.onValuesChange(...args)}
                >
                    {this.renderForm()}
                    {children}
                </Form>
            </Dialog>
        );
    }

}
