import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {action, observable, runInAction} from "mobx";
import * as PropTypes from "prop-types";
import FormDialog from "../../../component/FormDialog";

class AppState {
    @observable siteList = [];
    @observable data = {};
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
export default class DetailDialog extends React.Component {
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

    render() {
        const {state: appState} = this.props;
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true,
        };
        return (
            <FormDialog
                state={appState.dialogState}>

                <Form layout="inline" style={{width: "100%"}}>
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                {...layout}
                                label="名称">
                                {appState.data["card_name"]}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item
                                {...layout}
                                label="归属">
                                {appState.data["user_name"]}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                {...layout}
                                label="类型">
                                {appState.data["card_type_name"]}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item
                                {...layout}
                                label="金额">
                                {appState.data["balance"]}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </FormDialog>
        );
    }
}


