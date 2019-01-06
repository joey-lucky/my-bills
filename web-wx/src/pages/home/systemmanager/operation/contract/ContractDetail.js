import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Col, Form, Row} from "antd";
import {DetailDialog, DetailDialogState} from"@components/DetailDialog";

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
class AppState extends DetailDialogState {
    @observable data = {};
}

@observer
class ContractDetail extends DetailDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 750;
        this.dialogTitle = "合同详情";
    }

    static newState() {
        return new AppState();
    }

    renderDetail() {
        const data = this.props.state.data;

        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem label="合同名称">
                            {data.NAME}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem label="合同别名">
                            {data.ALIAS}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="合同编号">
                            {data.CONTRACT_NO}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem label="甲方名称">
                            {data.CUSTOMERS_NAME}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem style={{width: 400}} label="合同开始时间">
                            {data.CONTRACT_START_DATE}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem style={{width: 400}} label="合同结束时间">
                            {data.CONTRACT_END_DATE}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(ContractDetail);
