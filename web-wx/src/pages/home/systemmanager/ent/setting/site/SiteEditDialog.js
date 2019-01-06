/**
 * 新增企业组件
 */
import React from "react";
import {observer} from "mobx-react";
import {Col, DatePicker, Form, Input, Row, Select} from "antd";
import {observable} from "mobx";
import moment from "moment";
import * as PropTypes from "prop-types";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import DomainSelect from "@components/DomainSelect";
import ImageUpload from "@components/ImageUpload";
import {Ajax} from "@utils/ajax";
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

    show() {
        super.show();
        Ajax.apiPost("/systemmanager/operation/company/list")
            .then((d) => {
                this.opCompanyList = d.data || [];
                if (this.opCompanyList.length > 0) {
                    this.data.OPERATION_UNIT = this.opCompanyList[0].ID;
                }
            });
    }

    onPlAreaCodeSelect = (value) => {
        this.data.PL_AREACODE = value;
    };

    onClAreaCodeSelect = (value) => {
        this.data.CL_AREACODE = value;
    };
}

@Form.create()
@observer
export default class SiteEditDialog extends FormDialog {
    constructor(props) {
        super(props);
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
        const codeEditable = this.props.actionURL.indexOf("create") !== -1;
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
                                    <Input value={entListState.ent.NAME} disabled/>
                                </FormItem>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem
                                    label="站点编号"
                                >
                                    {this.getFieldDecorator("ID")(<Input disabled={!codeEditable}/>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem
                                    label="站点名称"
                                >
                                    {this.getFieldDecorator("NAME", {
                                        rules: [{
                                            required: true,
                                            message: "请输入站点名称!"
                                        }]
                                    })(<Input/>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="照片">
                            {this.getFieldDecorator("PHOTO")(<ImageUpload/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="数采仪编码">
                            {this.getFieldDecorator("MN")(<Input/>)}
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
                                            onSelect={appState.onPlAreaCodeSelect}
                                            width="100%"
                                        />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    style={{width: "20%"}}
                                    wrapperCol={{span: 24}}
                                >
                                    {this.getFieldDecorator("CL_AREACODE")(
                                        <DomainSelect
                                            parentCode={appState.data.PL_AREACODE || "无"}
                                            dictTypeCode="PROVINCE"
                                            onSelect={appState.onClAreaCodeSelect}
                                            width="100%"
                                        />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    style={{width: "20%"}}
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
                            label="经度"
                        >
                            {this.getFieldDecorator("LONGITUDE")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="纬度"
                        >
                            {this.getFieldDecorator("LATITUDE")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="监管级别"
                        >
                            {this.getFieldDecorator("REGULATORY_LEVEL")(
                                <DomainSelect
                                    dictTypeCode="REGULATORY_LEVEL"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="标志牌安装形式"
                        >
                            {this.getFieldDecorator("SIGN_INSTALL_TYPE")(
                                <DomainSelect
                                    dictTypeCode="STATION_INSTALL_TYPE"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="运营单位">
                            {this.getFieldDecorator("OPERATION_UNIT")(
                                <Select
                                    showSearch
                                >
                                    {
                                        appState.opCompanyList.map((item, index) =>
                                            <Select.Option
                                                key={item.ID}
                                            >{item.NAME}</Select.Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="运营单位联系人">
                            {this.getFieldDecorator("OPERATION_CONNECTER")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="运营联系电话">
                            {this.getFieldDecorator("OPERATION_PHONE")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="数字认证编码">
                            {this.getFieldDecorator("DAI_AUT_NUMBER")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="投产日期">
                            {this.getFieldDecorator("CREATETIME")(
                                <DatePicker
                                    style={{width: "100%"}}
                                    format="YYYY-MM-DD"
                                    placeholder="请选择时间"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="数采传输方式">
                            {this.getFieldDecorator("DAI_TRA_MODE")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="站点地址"
                        >
                            {this.getFieldDecorator("ADDRESS")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}/>
                </Row>
            </Form>
        );
    }
}
