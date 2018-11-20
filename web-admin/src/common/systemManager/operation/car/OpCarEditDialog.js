import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";
import TableSelect from "../../../component/TableSelect";

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


    show = () => {
        super.show();
    };

    hide = () => {
        super.hide();
    };
}

@Form.create()
@observer
export default class OpCarEditDialog extends FormDialog {
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
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem label="车辆名称">
                            {this.getFieldDecorator("CAR_NAME")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="车牌号">
                            {this.getFieldDecorator("CAR_NO")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="运维组">
                            {this.getFieldDecorator("GROUP_ID")(
                                <TableSelect
                                    url="/systemmanager/operation/group/list"
                                    parse={{CODE: "ID", VALUE: "NAME"}}
                                    width="100%"
                                />
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
