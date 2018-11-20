import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row, Select} from "antd";
import * as PropTypes from "prop-types";
import {observable} from "mobx";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";
import DomainSelect from "../../../component/DomainSelect";
import UsTransfer from "../../../component/UsTransfer";
import {Ajax} from "../../../unit/ajax";

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
    @observable confirmLoading = false;

    @observable siteList = [];
    @observable pollList = [];
    @observable userList = [];

    show = () => {
        this.visible = true;
        this.confirmLoading = false;
        this.loadInitData();
    };

    hide = () => {
        this.visible = false;
        this.confirmLoading = false;
    };

    loadInitData = () => {
        Ajax.apiPost("/systemmanager/usersafe/user/list")
            .then((d) => {
                this.userList = d.data.map(item => ({ID: item.ID, NAME: item.REAL_NAME, key: item.ID}));
            });
        Ajax.apiPost("/systemmanager/ent/setting/site/list")
            .then((d) => {
                this.siteList = d.data || [];
                if (!this.data.SITE_ID && this.siteList.length > 0) {
                    this.data.SITE_ID = this.siteList[0].ID;
                }
                this.data.SITE_ID && this.loadDeviceData(this.data.SITE_ID);
            });
    };

    loadDeviceData = (siteId) => {
        Ajax.apiPost("/systemmanager/ent/setting/sitepoll/list", {SITE_ID: siteId})
            .then((d) => {
                this.pollList = d.data || [];
            });
    };

    onSiteSelect = (siteId) => {
        this.loadDeviceData(siteId);
    };
}

@observer
class AlarmSettingEditDialog extends FormDialog {
    static propTypes = {
        state: PropTypes.any,
        form: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    constructor(props) {
        super(props);
        this.dialogWidth = 750;
    }

    beforeSubmit(value) {
        value.SITE_ID = value.SITE_ID;
        const BC_ALARM_PLAN_USER = value.BC_ALARM_PLAN_USER.map(item => ({USER_ID: item}));
        value.relationModelMap = {BC_ALARM_PLAN_USER};
        return value;
    }

    renderForm() {
        const {state} = this.props;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem label="所属站点">
                            {this.getFieldDecorator("SITE_ID")(
                                <Select
                                    showSearch
                                    onSelect={state.onSiteSelect}
                                >
                                    {
                                        state.siteList.map((item, index) =>
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
                        <FormItem label="参数名称">
                            {this.getFieldDecorator("POLL_CODE")(
                                <Select
                                    showSearch
                                >
                                    {
                                        state.pollList.map((item, index) =>
                                            <Select.Option
                                                key={item.POLL_CODE}
                                            >{item.POLL_CODE_DESC}</Select.Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="时间周期"
                        >
                            {this.getFieldDecorator("TIME_CYCLE")(
                                <DomainSelect
                                    dictTypeCode="TIME_CYCLE"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="报警类型"
                        >
                            {this.getFieldDecorator("ALARM_TYPE")(
                                <DomainSelect
                                    dictTypeCode="ALARM_TYPE"
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    {this.getFieldDecorator("BC_ALARM_PLAN_USER")(<UsTransfer dataSource={state.userList}/>)}
                </Row>
            </Form>
        );
    }

    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;
        if (id === "BC_ALARM_PLAN_USER") {
            let userIds = state.data.USER_ID_S || "";
            options.initialValue = userIds.split(",");
        } else {
            options.initialValue = state.data[id];
        }
        return form.getFieldDecorator(id, options);
    };
}

export default Form.create()(AlarmSettingEditDialog);
