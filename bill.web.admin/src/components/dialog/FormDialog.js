import React from "react";
import {action, observable, toJS} from "mobx";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import Assert from "@utils/Assert";
import {Form, Modal} from "antd";
import Dialog from "./Dialog";

let formNameIndex = 0;

// 去除字符串两侧的空格
function trimAroundSpace(obj = {}) {
    let result = {};
    Object.entries(obj).forEach((item) => {
        let key = item[0];
        let value = item[1];
        if (typeof value === "string") {// 去除所有的空格
            value = value.replace(/(^\s+)|(\s+$)/g, "");
        }
        result[key] = value;
    });
    return result;
}

@observer
export default class FormDialog extends React.Component {
    static propTypes = {
        // 请求
        loadData: PropTypes.func.isRequired,
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
        const {onFinish, onFinishFailed, loadData, successMessage} = this.props;
        //不捕捉异常，托管给Form页面捕捉
        this.formRef.current.validateFields().then(async (values) => {
            this.showConfirmLoading();
            try {
                Assert.notNull(loadData, "actionURL 为空");
                values = Object.assign({}, this.record, values);
                values = trimAroundSpace(values);
                values = this.beforeSubmit(values);
                let d = await loadData(values);
                this.hideConfirmLoading();
                this.hide();
                const message = successMessage || d.message;
                if (message) {
                    Modal.success({
                        title: "提示",
                        content: message,
                        okText: "确定"
                    });
                }
                onFinish && onFinish(d);
            } catch (e) {
                this.hideConfirmLoading();
                Modal.error({
                    title: "错误",
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
        data = {...toJS(data)};
        this.record = this.beforeShow(data);
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
