/**
 * 新增企业组件
 */
import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {observable} from "mobx";
import {Ajax} from "@utils/ajax";
import {FormDialog, FormDialogState} from "@components/FormDialog";

class AppState extends FormDialogState {
    @observable siteList = [];

    @observable data = {};

    loadSiteList = (entId) => {
        Ajax.apiPost("/systemmanager/ent/setting/site/list", {ENT_ID: entId})
            .then((d) => {
                this.siteList = d.data || [];
                if (this.siteList.length > 0) {
                    this.data.SITE_ID = this.siteList[0].ID;
                }
            });
    };
}

Form.create();
@observer
export default class DeviceOpSettingDetailDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 900;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        return values;
    }

    renderForm() {
        const appState = this.props.state;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label={"耗材项"}
                            style={{width: "100%"}}
                            colon
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            {appState.data.SITE_ID_DESC + "/" + appState.data.DEVICE_ID_DESC + "/" + appState.data.SUPPLIES_DESC}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item
                            label={"运维周期"}
                            style={{width: "100%"}}
                            colon
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            {appState.data.TASK_CYCLE_DESC}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item
                            label={"任务容限"}
                            style={{width: "100%"}}
                            colon
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            {appState.data.TASK_ALLOWANCE_DESC}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

