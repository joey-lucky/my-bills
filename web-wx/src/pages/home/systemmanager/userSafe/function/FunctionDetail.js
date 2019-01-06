import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import * as functionStyle from "./function.css";
import {DetailDialog, DetailDialogState} from"@components/DetailDialog";

const FormItem = Form.Item;

class FunctionDetailState extends DetailDialogState {

}

@observer
export default class FunctionDetail extends DetailDialog {

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
    }

    static newState() {
        return new FunctionDetailState();
    }

    renderDetail() {
        let labelSpan = {
            span: 6
        };
        let fieldSpan = {
            span: 18
        };
        let urlList = [];

        if (this.props.state.data.URL_LIST != null) {
            let urls = this.props.state.data.URL_LIST.split(",");
            urls.forEach(url => urlList.push(
                <span className={functionStyle.url_item} key={url}>{url}</span>
            ));
        }
        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem label="功能代码" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {this.props.state.data.CODE}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="功能名称" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {this.props.state.data.NAME}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="功能地址" labelCol={{span: 3}} wrapperCol={{span: 21}}>
                    {urlList}
                </FormItem>
            </Form>
        );
    }

}
