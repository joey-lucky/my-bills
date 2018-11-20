import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {DetailDialog, DetailDialogState} from "../../../component/DetailDialog";

const FormItem = Form.Item;

class UserState extends DetailDialogState {
}

@observer
export default class UserDetail extends DetailDialog {

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
        this.dialogTitle = "详情";
    }

    static newState() {
        return new UserState();
    }

    renderDetail() {

        var labelSpan = {
            span: 6
        };
        var fieldSpan = {
            span: 18
        };

        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem label="账号" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {this.props.state.data.ACCOUNT}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="姓名" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {this.props.state.data.REAL_NAME}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="电话" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {this.props.state.data.TEL}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="企业微信" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {this.props.state.data.ENT_WECHAT_ID}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="企业微信" labelCol={{span: 3}} wrapperCol={{span: 21}}>
                    <img
                        role="presentation"
                        style={{"maxWidth": 400}}
                        src={window.getBasePath() + "/file" + this.props.state.data.PHOTO}
                    />
                </FormItem>
            </Form>
        );
    }

}
