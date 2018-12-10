import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {action, observable, runInAction} from "mobx";
import * as PropTypes from "prop-types";
import Ajax from "../../../services/Ajax";
import FormDialog from "../../../component/FormDialog";
import TableSelect from "../../../component/TableSelect";

class AppState {
    @observable siteList = [];
    @observable data = {
        "card_id": "",
        "user_id": "",
        "bill_type_id": "",
        "money": "",
        "bill_desc": "",
    };
    dialogState = FormDialog.newState();

    constructor() {
        runInAction(() => {
            this.dialogState.width = 800;
        });
    }

    @action
    show(data = {}) {
        this.data = data;
        this.dialogState.visible = true;
        this.dialogState.confirmLoading = false;
    }

    @action
    hide() {
        this.dialogState.visible = false;
        this.dialogState.confirmLoading = false;
    }

    setTitle(title) {
        this.dialogState.title = title;
    }
}

@Form.create()
@observer
export default class AddAndEditDialog extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        onSubmitSuccess: PropTypes.any,
        onSubmitError: PropTypes.any,
        url: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    constructor(props, context) {
        super(props, context);
        const {state, title} = props;
        state.setTitle(title);
    }

    // 装饰器
    getFieldDecorator = (id, options = {}) => {
        const appState = this.props.state;
        options.initialValue = appState.data[id];
        return this.props.form.getFieldDecorator(id, options);
    };

    onOkClick = () => {
        const {state, onSubmitSuccess, onSubmitError, url} = this.props;
        this.props.form.validateFields((err, values) => {
            if (err) {
                state.hide();
                onSubmitError && onSubmitError(err);
            } else {
                let data = [{...this.props.state.data, ...values}];
                Ajax.apiPost(url, {"table_name": "bd_bill", data: data})
                    .then(
                        (d) => {
                            state.hide();
                            onSubmitSuccess && onSubmitSuccess(d);
                        },
                        (err) => {
                            state.hide();
                            onSubmitError && onSubmitError(err);
                        });
            }
        });
    };

    render() {
        const {state: {dialogState}} = this.props;
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true,
        };
        return (
            <FormDialog
                state={dialogState}
                onOkClick={this.onOkClick}>

                <Form layout="inline" style={{width: "100%"}}>
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                {...layout}
                                label="详情">
                                {this.getFieldDecorator("bill_desc")(
                                    <Input/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item
                                {...layout}
                                label="金额">
                                {this.getFieldDecorator("money")(
                                    <Input type={"number"}/>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                {...layout}
                                label="银行卡">
                                {this.getFieldDecorator("card_id")(
                                    <TableSelect
                                        style={{width: "100%"}}
                                        url={"/table/list"}
                                        parse={{id:"id",name:"name"}}
                                        params={{"table_name": "bc_card"}}/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item
                                {...layout}
                                label="用户">
                                {this.getFieldDecorator("user_id")(
                                    <TableSelect
                                        style={{width: "100%"}}
                                        url={"/table/list"}
                                        parse={{id:"id",name:"name"}}
                                        params={{"table_name": "bc_user"}}/>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <Form.Item
                                {...layout}
                                label="银行卡">
                                {this.getFieldDecorator("bill_type_id")(
                                    <TableSelect
                                        style={{width: "100%"}}
                                        url={"/table/list"}
                                        parse={{id:"id",name:"name"}}
                                        params={{"table_name": "bc_bill_type"}}/>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </FormDialog>
        );
    }
}


