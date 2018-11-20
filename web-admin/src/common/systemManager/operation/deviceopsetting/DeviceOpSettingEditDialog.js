/**
 * 新增企业组件
 */
import React from "react";
import moment from "moment";
import {observer} from "mobx-react";
import {Cascader, Col, Form, Row} from "antd";
import {computed, observable} from "mobx";
import {Ajax} from "../../../unit/ajax";
import {entListState} from "../../ent/setting/EntManager";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";
import DomainSelect from "../../../component/DomainSelect";

class AppState extends FormDialogState {
    @observable siteList = [];

    @observable data = {
        SUPPLIES_ID: []

    };

    @observable siteDeviceSuppliesData = [];

    @computed
    get entId() {
        return entListState.ent.ID;
    }

    constructor() {
        super();
        let asyncSiteList = Ajax.apiPost("/systemmanager/operation/deviceopsettting/site-list");
        let asyncDeviceList = Ajax.apiPost("/systemmanager/operation/deviceopsettting/device-list");
        let asyncSuppliesList = Ajax.apiPost("/systemmanager/operation/deviceopsettting/dict-list", {DICT_TYPE_CODE: "SUPPLIES_REPLACE_DEVICE_ITEM"});

        // 构建数据树
        Promise.all([asyncSiteList, asyncDeviceList, asyncSuppliesList])
            .then((values) => {
                // 组装数据
                const [d1, d2, d3] = values;
                let siteData = d1.data || [];
                let deviceData = d2.data || [];
                let suppliesData = d3.data || [];

                // 根据设备类型将耗材分组
                let suppliesByDeviceTypeMap = new Map();
                suppliesData.forEach((item) => {
                    let code = item.CODE;
                    let children = item.children || [];
                    // 解析数据
                    let data = children.map(childItem => ({
                        value: childItem.CODE,
                        label: childItem.VALUE
                    }));
                    suppliesByDeviceTypeMap.set(code, data);
                });

                // 根据站点将设备分组
                let devicesBySiteMap = new Map();
                deviceData.forEach((item) => {
                    let siteId = item.SITE_ID;
                    let deviceId = item.ID;
                    let deviceName = item.NAME;
                    let deviceType = item.DEVICE_TYPE;
                    let suppliesList = suppliesByDeviceTypeMap.get(deviceType) || [];

                    if (!devicesBySiteMap.has(siteId)) {
                        devicesBySiteMap.set(siteId, []);
                    }
                    let deviceArray = devicesBySiteMap.get(siteId);
                    deviceArray.push({
                        value: deviceId,
                        label: deviceName,
                        children: suppliesList
                    });
                });

                // 生成数据
                this.siteDeviceSuppliesData = siteData.map((item) => {
                    let siteId = item.ID;
                    let siteName = item.NAME;
                    let deviceList = devicesBySiteMap.get(siteId) || [];
                    return {
                        value: siteId,
                        label: siteName,
                        children: deviceList
                    };
                });
            });
    }
}

@Form.create()
@observer
export default class DeviceOpSettingEditDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 900;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        let [deviceId = "", suppliesId = ""] = values.SUPPLIES_ID;
        return {
            TASK_CYCLE: values.TASK_CYCLE,
            TASK_ALLOWANCE: values.TASK_ALLOWANCE,
            DEVICE_ID: deviceId,
            SUPPLIES: suppliesId
        };
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


    filter(inputValue, path) {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
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
                            {this.getFieldDecorator("SUPPLIES_ID")(
                                <Cascader
                                    showSearch={{filter: this.filter}}
                                    options={appState.siteDeviceSuppliesData}
                                    placeholder="Please select"
                                />
                            )}
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
                            {this.getFieldDecorator("TASK_CYCLE")(
                                <DomainSelect
                                    dictTypeCode="TASK_CYCLE"
                                    width="100%"
                                />
                            )}
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
                            {this.getFieldDecorator("TASK_ALLOWANCE")(
                                <DomainSelect
                                    dictTypeCode="TASK_ALLOWANCE"
                                    width="100%"
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
