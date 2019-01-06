import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Col, Form, Input, Row, Select} from "antd";
import {Ajax} from "@utils/ajax";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import DomainSelect from "@components/DomainSelect";

// 默认左右两边的form item
const FormItem = ({label = "", children, labelCol = {span: 8}, wrapperCol = {span: 16}}) => (
    <Form.Item
        label={label}
        style={{width: "100%"}}
        colon
        labelCol={labelCol}
        wrapperCol={wrapperCol}
    >
        {children}
    </Form.Item>
);
FormItem.propTypes = {
    label: PropTypes.any,
    children: PropTypes.any,
    labelCol: PropTypes.any,
    wrapperCol: PropTypes.any
};
class AppState extends FormDialogState {
    @observable data = {};

    @observable contractList = [];

    loadContractsData = () => {
        Ajax.apiPost("/systemmanager/operation/contract/list-model")
            .then((d) => {
                this.contractList = d.data || [];
            });
    };

    show = () => {
        this.loadContractsData();
        super.show();
    };

    hide = () => {
        super.hide();
    };
}

@observer
class OpJobEditDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 750;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(value) {
        return value;
    }

    renderForm() {
        const {state} = this.props;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem label="任务名称">
                            {this.getFieldDecorator("NAME")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="合同">
                            {this.getFieldDecorator("CONTRACT_ID")(
                                <Select
                                    showSearch
                                    onSelect={state.onSiteSelect}
                                >
                                    {
                                        state.contractList.map((item, index) =>
                                            <Select.Option
                                                key={item.ID}
                                            >{item.NAME}</Select.Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="任务级别">
                            {this.getFieldDecorator("JOB_LEVEL")(
                                <DomainSelect
                                    dictTypeCode="JOB_LEVEL"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={11} offset={2}>
                        <FormItem label="任务类别">
                            {this.getFieldDecorator("JOB_TYPE")(
                                <DomainSelect
                                    width="100%"
                                    dictTypeCode="OP_JOB_TYPE"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem
                            label="任务描述"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            {this.getFieldDecorator("JOB_DESC")(
                                <Input.TextArea rows={4} cols={70}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;
        options.initialValue = state.data[id];
        return form.getFieldDecorator(id, options);
    };
}

export default Form.create()(OpJobEditDialog);
