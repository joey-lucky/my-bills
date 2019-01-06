/**
 * 新增企业组件
 */
import React from "react";
import {observer} from "mobx-react";
import {Col, DatePicker, Form, Input, Modal, Row, Select} from "antd";
import {observable} from "mobx";
import moment from "moment";
import * as PropTypes from "prop-types";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import {Ajax} from "@utils/ajax";
import DomainSelect from "@components/DomainSelect";

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
    @observable companyData = [];
    @observable data = {};

    show() {
        super.show();
        Ajax.apiPost("/systemmanager/operation/company/list")
            .then((d) => {
                this.companyData = d.data || [];
            });
    }

    onPlAreaCodeSelect = (value) => {
        this.data.PL_AREACODE = value;
    };

    onClAreaCodeSelect = (value) => {
        this.data.CL_AREACODE = value;
    };
}

@observer
class EntEditDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/ent/setting/ent/create";
        this.dialogWidth = 750;
        this.dialogTitle = "新增企业";
    }

    // 装饰器
    getFieldDecorator = (id, options = {}) => {
        const appState = this.props.state;
        if (id === "COMMISSIONING_DATE") {
            options.initialValue = moment(appState.data.COMMISSIONING_DATE);
        } else {
            options.initialValue = appState.data[id];
        }
        return this.props.form.getFieldDecorator(id, options);
    };

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        let COMMISSIONING_DATE = values.COMMISSIONING_DATE;
        values.COMMISSIONING_DATE = COMMISSIONING_DATE.format("YYYY-MM-DD hh:mm:ss");
        values.CODE = values.ID;
        return values;
    }

    onSubmitSuccess(msg) {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.props.onSubmitSuccess();
    }

    renderForm() {
        const appState = this.props.state;
        const {actionURL} = this.props;
        const codeEditable = actionURL.indexOf("create") !== -1;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="企业名称"
                        >
                            {this.getFieldDecorator("NAME", {rules: [{required: true, message: "请输入企业名称!"}]})(
                                <Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="企业编号"
                        >
                            {this.getFieldDecorator("ID", {rules: [{required: true, message: "请输入企业编码!"}]})(
                                <Input disabled={!codeEditable}/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="法人代码"
                        >
                            {this.getFieldDecorator("LEGAL_PERSON_CODE")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="企业地址"
                        >
                            {this.getFieldDecorator("ADDRESS")(<Input/>)}
                        </FormItem>
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
                                    style={{width: "20%"}}
                                    wrapperCol={{span: 24}}
                                >
                                    {this.getFieldDecorator("PL_AREACODE")(
                                        <DomainSelect
                                            dictTypeCode="PROVINCE"
                                            width="100%"
                                            onSelect={appState.onPlAreaCodeSelect}
                                        />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    style={{width: "20%", marginLeft: "5%"}}
                                    wrapperCol={{span: 24}}
                                >
                                    {this.getFieldDecorator("CL_AREACODE")(
                                        <DomainSelect
                                            dictTypeCode="PROVINCE"
                                            parentCode={appState.data.PL_AREACODE || "无"}
                                            width="100%"
                                            onSelect={appState.onClAreaCodeSelect}
                                        />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    style={{width: "20%", marginLeft: "5%"}}
                                    wrapperCol={{span: 24}}
                                >
                                    {this.getFieldDecorator("DL_AREACODE")(
                                        <DomainSelect
                                            parentCode={appState.data.CL_AREACODE || "无"}
                                            dictTypeCode="PROVINCE"
                                            width="100%"
                                        />
                                    )}
                                </Form.Item>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="企业规模"
                        >
                            {this.getFieldDecorator("SCALE")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="行业类型"
                        >
                            {this.getFieldDecorator("INDUSTRY_TYPE")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="投产日期"
                        >
                            {this.getFieldDecorator("COMMISSIONING_DATE")(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="请选择时间"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="建设状态"
                        >
                            {this.getFieldDecorator("CONSTRUCTION_STATE")(
                                <DomainSelect
                                    dictTypeCode="CONSTRUCTION_STATE"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="受纳水体"
                        >
                            {this.getFieldDecorator("RECEIVE_WATER", {rules: []})(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="排放流域"
                        >
                            {this.getFieldDecorator("DRAINAGE_BASIN", {rules: []})(
                                <DomainSelect
                                    dictTypeCode="STORM_SYSTEM"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="是否可监控">
                            {this.getFieldDecorator("CAN_MONITOR")(
                                <DomainSelect
                                    dictTypeCode="WHETHER"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="运营单位">
                            {this.getFieldDecorator("OPERATION_UNIT")(
                                <Select
                                    showSearch
                                    style={{width: "100%"}}
                                >{
                                    this.props.state.companyData.map((item, index) =>
                                        <Option key={item.ID}>
                                            {item.NAME}
                                        </Option>
                                    )
                                }</Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="法人代表">
                            {this.getFieldDecorator("LEGAL_REP")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="占地面积">
                            {this.getFieldDecorator("AREA_COVERED")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="环保负责人">
                            {this.getFieldDecorator("EP_CHARGE_PERSON")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="专职环保人数">
                            {this.getFieldDecorator("EP_STAFF_NUMBER")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="开户银行">
                            {this.getFieldDecorator("BANK")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="银行账户">
                            {this.getFieldDecorator("BANK_ACCOUNT")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="办公电话">
                            {this.getFieldDecorator("TEL")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="移动电话">
                            {this.getFieldDecorator("MOBILE")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="传真">
                            {this.getFieldDecorator("FAX")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="联系人">
                            {this.getFieldDecorator("CONTACT")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="企业网址">
                            {this.getFieldDecorator("WEBSITE")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="电子邮箱">
                            {this.getFieldDecorator("EMAIL")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="隶属关系">
                            {this.getFieldDecorator("AFFILIATION")(
                                <DomainSelect
                                    dictTypeCode="AFFILIATION"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="业务分类">
                            {this.getFieldDecorator("BUSS_CATEGORY")(
                                <DomainSelect
                                    dictTypeCode="BUSS_CATEGORY"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem
                            label="公司简介"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            {this.getFieldDecorator("REMARK")(
                                <Input.TextArea rows={4} cols={70}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(EntEditDialog);
