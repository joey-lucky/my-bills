import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {observable} from "mobx";
import * as PropTypes from "prop-types";
import {FormDialog, FormDialogState} from "../common/component/FormDialog";

class AppState extends FormDialogState {
    @observable data = {};
}

/**
 * 强制：表单界面都要有@Form.create()装饰
 */
@Form.create()
@observer
export default class FormEditDialog extends FormDialog {
    // propTypes是必须的，用于定义组件的props
    static propTypes = {
        form: PropTypes.object.any,
        state: PropTypes.object.any
    };

    /**
     * 强制：表单界面必须包含newState
     */
    static newState() {
        return new AppState();
    }

    /**
     * 建议：对默认值的处理，可封装一个方法如下。
     * 当组件所需值的格式跟data中的值不同时，比如日期组件，需要的默认值是moment对象，而data中的时间是字符串，可进行如下转换
     * options.initialValue = moment(appState.data[id]);
     */
    getFieldDecorator = (id, options = {}) => {
        const appState = this.props.state;
        options.initialValue = appState.data[id];
        return this.props.form.getFieldDecorator(id, options);
    };

    /**
     * 提交前处理，一般是对数据格式的转换和修改。
     */
    beforeSubmit(values) {
        return values;
    }

    renderForm() {
        let layout = {
            labelCol: {
                xs: {span: 10}
            },
            wrapperCol: {
                xs: {span: 14}
            }
        };
        return (
            <Form layout="inline">
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="代码"
                        >
                            {
                                this.getFieldDecorator("CODE", {
                                    rules: [{required: true, message: "代码不能为空"}]
                                })(<Input/>)
                            }
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="值"
                        >
                            {
                                this.getFieldDecorator("VALUE", {
                                    rules: [{required: true, message: "值不能为空"}]
                                })(<Input/>)
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="单位"
                        >
                            {
                                this.getFieldDecorator("UNIT", {
                                    rules: [{required: true, message: "单位不能为空"}]
                                })(<Input/>)
                            }
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="排序"
                        >
                            {
                                this.getFieldDecorator("ORDER_CODE", {
                                    rules: [{required: true, message: "排序不能为空"}]
                                })(<Input/>)
                            }
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

FormEditDialog.submit = function() {
    this.setState({confirmLoading: false});
    this.props.state.hide();
    this.props.onSubmitSuccess();
};
