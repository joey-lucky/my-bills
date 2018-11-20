/**
 * 新增企业组件
 */
import React from "react";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Col, Form, Row} from "antd";
import {autorun, observable} from "mobx";
import moment from "moment";
import {Ajax} from "../../../../unit/ajax";
import {entListState} from "../EntManager";
import {FormDialog, FormDialogState} from "../../../../component/FormDialog";

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
    @observable siteList = [];

    @observable data = {};

    constructor() {
        super();
        autorun(() => {
            const entId = entListState.ent.ID;
            this.loadSiteList(entId);
        });
    }

    loadSiteList = (entId) => {
        Ajax.apiPost("/systemmanager/ent/setting/site/list", {ENT_ID: entId})
            .then((d) => {
                this.siteList = d.data || [];
                if (this.siteList.length > 0) {
                    this.data.SITE_ID = this.siteList[0].ID;
                }
            });
    };

    componentDidMount = () => {
        const entId = entListState.ent.ID;
        this.loadSiteList(entId);
    };
}

@observer
class DeviceDetailDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 750;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        return values;
    }


    // 装饰器
    getFieldDecorator = (id, options = {}) => {
        const appState = this.props.state;
        if (id === "CREATETIME") {
            options.initialValue = moment(appState.data.COMMISSIONING_DATE);
        } else {
            options.initialValue = appState.data[id];
        }
        return this.props.form.getFieldDecorator(id, options);
    };

    renderForm() {
        const appState = this.props.state;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem label="所属站点">
                            {appState.data.SITE_ID_DESC}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="设备名称">
                            {appState.data.NAME}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="设备型号"
                        >
                            {appState.data.MODEL}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="设备出厂编号"
                        >
                            {appState.data.MFE_NUMBER}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="环保认证编号"
                        >
                            {appState.data.AUT_NUMBER}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="生产厂商"
                        >
                            {appState.data.MFR}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="厂商联系人"
                        >
                            {appState.data.MFR_CONTACT}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="厂商电话"
                        >
                            {appState.data.MFR_TEL}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="许可编号"
                        >
                            {appState.data.MFE_LICENSE_NUMBER}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="厂商电话"
                        >
                            {appState.data.DEVICE_TYPE_DESC}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    componentDidMount() {
        this.props.state.componentDidMount();
    }
}

export default Form.create()(DeviceDetailDialog);
