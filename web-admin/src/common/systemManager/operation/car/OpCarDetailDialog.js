import React from "react";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {observable} from "mobx";
import {Col, Form, Row} from "antd";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";

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
export default class OpCarDetailDialog extends FormDialog {
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
                        <FormItem label="车辆名称">
                            {state.data.CAR_NAME}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="车牌号">
                            {state.data.CAR_NO}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="运维组">
                            {state.data.GROUP_ID_DESC}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}
