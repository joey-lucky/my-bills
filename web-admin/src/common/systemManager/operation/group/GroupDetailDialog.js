import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {DetailDialog, DetailDialogState} from "../../../component/DetailDialog";

const FormItem = Form.Item;

class GroupState extends DetailDialogState {
}

@observer
export default class GroupDetailDialog extends DetailDialog {

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
    }

    static newState() {
        return new GroupState();
    }

    renderDetail() {
        return (
            <Form layout="inline">
                <Row>
                    <Col span={12}>
                        <FormItem label="运维组名称">
                            {this.props.state.data.NAME}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="所属公司">
                            {this.props.state.data.OPMC_ID_DESC}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="组类型">
                            {this.props.state.data.GROUP_TYPE_DESC}
                        </FormItem>
                    </Col>

                </Row>
            </Form>
        );
    }
}
