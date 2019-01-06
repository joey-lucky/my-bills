import React from "react";
import {observer} from "mobx-react";
import moment from "moment";
import {Col, DatePicker, Form, Input, Modal, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import DomainSelect from "@components/DomainSelect";

const FormItem = Form.Item;

class CompanyState extends FormDialogState {
}

@Form.create()
@observer
export default class CompanyEdit extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/operation/company/update";
        this.dialogWidth = 650;
        this.dialogTitle = "编辑公司";
    }

    static newState() {
        return new CompanyState();
    }

    beforeSubmit(values) {
        if (values) {
            values.SET_TIME = values.SET_TIME.format("YYYY-MM-DD") + " 00:00:00";
        }
        return values;
    }

    onSubmitSuccess(msg) {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.props.onEdited();
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        const {TextArea} = Input;
        var nameFiled = getFieldDecorator("NAME", {
            initialValue: this.props.state.data.NAME,
            rules: [{required: true, message: "请输入单位名称!"}]
        })(<Input/>);
        var legalFiled = getFieldDecorator("LEGAL_REP", {initialValue: this.props.state.data.LEGAL_REP, rules: []})(
            <Input/>);
        var setTimeFiled = getFieldDecorator("SET_TIME", {
            initialValue: moment(this.props.state.data.SET_TIME, "YYYY-MM-DD"),
            rules: []
        })(<DatePicker placeholder="请选择时间"/>);
        var natureOfBusFiled = getFieldDecorator("NATURE_OF_BUSINESS", {
            initialValue: this.props.state.data.NATURE_OF_BUSINESS,
            rules: []
        })(<DomainSelect dictTypeCode="COMPANY_NATURE"/>);
        var registeredCapitalFiled = getFieldDecorator("REGISTERED_CAPITAL", {
            initialValue: this.props.state.data.REGISTERED_CAPITAL,
            rules: []
        })(<Input/>);
        var numberOfEmplyFiled = getFieldDecorator("NUMBER_OF_EMPLOYEES", {
            initialValue: this.props.state.data.NUMBER_OF_EMPLOYEES,
            rules: []
        })(<Input/>);
        var contactsFiled = getFieldDecorator("CONTACTS", {initialValue: this.props.state.data.CONTACTS, rules: []})(
            <Input/>);
        var telFiled = getFieldDecorator("TEL", {initialValue: this.props.state.data.TEL, rules: []})(<Input/>);
        var addressFiled = getFieldDecorator("ADDRESS", {initialValue: this.props.state.data.ADDRESS, rules: []})(
            <Input/>);
        var emailFiled = getFieldDecorator("EMAIL", {initialValue: this.props.state.data.EMAIL, rules: []})(<Input/>);
        var companyProfileField = getFieldDecorator("COMPANY_PROFILE", {
            initialValue: this.props.state.data.COMPANY_PROFILE,
            rules: []
        })(<TextArea rows={4} cols={70}/>);
        return (
            <Form layout="inline">
                <Row>
                    <Col span={12}>
                        <FormItem label="公司名称">
                            {nameFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="法人代表">
                            {legalFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="成立时间">
                            {setTimeFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="企业性质">
                            {natureOfBusFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="注册资金">
                            {registeredCapitalFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="员工人数">
                            {numberOfEmplyFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="联系人">
                            {contactsFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="联系电话">
                            {telFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="单位地址">
                            {addressFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="电子邮箱">
                            {emailFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label="公司简介">
                            {companyProfileField}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

}
