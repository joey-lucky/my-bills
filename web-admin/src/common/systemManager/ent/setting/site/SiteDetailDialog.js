/**
 * 新增企业组件
 */
import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import moment from "moment";
import * as PropTypes from "prop-types";
import {observable} from "mobx";
import {FormDialog, FormDialogState} from "../../../../component/FormDialog";
import {Ajax} from "../../../../unit/ajax";
import {entListState} from "../EntManager";

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
    @observable opCompanyList = [];

    @observable data = {};

    loadInitData = () => {
        Ajax.apiPost("/systemmanager/operation/company/list")
            .then((d) => {
                this.opCompanyList = d.data || [];
                if (this.opCompanyList.length > 0) {
                    this.data.OPERATION_UNIT = this.opCompanyList[0].ID;
                }
            });
    }
}

@observer
class SiteDetailDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/ent/setting/site/create";
        this.dialogWidth = 750;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        let CREATETIME = values.CREATETIME;
        values.CREATETIME = CREATETIME.format("YYYY-MM-DD hh:mm:ss");
        values.ENT_ID = entListState.ent.ID;
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
                <Row
                    type="flex"
                >
                    <Col span={11}>
                        <Row>
                            <Col span={24}>
                                <FormItem
                                    label="所属企业"
                                >
                                    {entListState.ent.NAME}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem
                                    label="站点名称"
                                >
                                    {appState.data.NAME}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem
                                    label="站点地址"
                                >
                                    {appState.data.ADDRESS}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11} offset={2}>
                        <img
                            role="presentation"
                            style={{height: 120}}
                            src={window.getBasePath() + "/file" + appState.data.PHOTO}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem
                            label="所属政区"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            <Row>
                                <Form.Item
                                    style={{width: "100%"}}
                                    wrapperCol={{span: 24}}
                                >
                                    {appState.data.PL_AREACODE_DESC}
                                    {appState.data.CL_AREACODE_DESC}
                                    {appState.data.DL_AREACODE_DESC}
                                </Form.Item>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="经度"
                        >
                            {appState.data.LONGITUDE}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="纬度"
                        >
                            {appState.data.LATITUDE}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="监管级别"
                        >
                            {appState.data.REGULATORY_LEVEL_DESC}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="标志牌安装形式"
                        >
                            {appState.data.SIGN_INSTALL_TYPE_DESC}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="运营单位">
                            {appState.data.OPERATION_UNIT_DESC}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="运营单位联系人">
                            {appState.data.OPERATION_CONNECTER}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="运营联系电话">
                            {appState.data.OPERATION_PHONE}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="数字认证编码">
                            {appState.data.DAI_AUT_NUMBER}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="投产日期">
                            {appState.data.CREATETIME}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="数采传输方式">
                            {appState.data.DAI_TRA_MODE}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="业务分类">
                            {appState.data.BUSS_CATEGORY_DESC}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="数采仪编码">
                            {appState.data.MN}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    componentDidMount() {
        this.props.state.loadInitData();
    }
}

export default Form.create()(SiteDetailDialog);
