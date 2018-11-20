import {Button, Cascader, Divider, Layout, Modal, Popconfirm, Table} from "antd";
import {observable, toJS} from "mobx";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import React from "react";
import {Ajax} from "../../../unit/ajax";
import DeviceOpSettingDetailDialog from "./DeviceOpSettingDetailDialog";
import DeviceOpSettingEditDialog from "./DeviceOpSettingEditDialog";
import * as style from "./DeviceOpSettingList.css";

const FormItem = props => (
    <div
        className={style.form}
        style={props.style}
    >
        {props.label && <div className={style.label}>{props.label + "："}</div>}
        <div className={style.item}>{props.children}</div>
    </div>
);
FormItem.propTypes = {
    label: PropTypes.any,
    children: PropTypes.any,
    style: PropTypes.any
};

class AppState {
    @observable dataSource = [];
    @observable filter = {};
    @observable siteIdWidthDeviceId = ["", ""];
    @observable siteDeviceSuppliesTree = [];

    deviceAddState = DeviceOpSettingEditDialog.newState();
    deviceEditState = DeviceOpSettingEditDialog.newState();
    deviceDetailState = DeviceOpSettingDetailDialog.newState();
}

@observer
export default class DeviceOpSettingList extends React.Component {
    static propTypes = {
        location: PropTypes.any,
        match: PropTypes.any,
        history: PropTypes.any
    };

    _appState = new AppState();

    _columns = [
        {
            title: "所属站点",
            dataIndex: "SITE_ID_DESC",
            key: "SITE_ID_DESC"
        },
        {
            title: "设备名称",
            dataIndex: "DEVICE_ID_DESC",
            key: "DEVICE_ID_DESC"
        },
        {
            title: "耗材项",
            dataIndex: "SUPPLIES_DESC",
            key: "SUPPLIES_DESC"
        },
        {
            title: "任务周期",
            dataIndex: "TASK_CYCLE_DESC",
            key: "TASK_CYCLE_DESC"
        },
        {
            title: "任务容限",
            dataIndex: "TASK_ALLOWANCE_DESC",
            key: "TASK_ALLOWANCE_DESC"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.onEditClick(text, record)}>编辑</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => this.onDeleteClick(text, record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            )
        }];

    componentDidMount() {
        let deviceId = this.getDeviceIdFromRoute(this.props);
        this.querySiteId(deviceId)
            .then((siteId) => {
                this.loadData({
                    SITE_ID: siteId,
                    DEVICE_ID: deviceId
                });
                this._appState.siteIdWidthDeviceId = [siteId, deviceId];
            });
        this.querySiteDeviceSuppliesTree()
            .then(data => this._appState.siteDeviceSuppliesTree = data);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            // url地址发生改变
            let nextDeviceId = this.getDeviceIdFromRoute(nextProps);
            let deviceId = this._appState.siteIdWidthDeviceId[1];
            if (nextDeviceId !== deviceId) {// 说明是通过浏览器录入的方式改变的地址
                this.querySiteId(nextDeviceId)
                    .then((siteId) => {
                        this.loadData({
                            SITE_ID: siteId,
                            DEVICE_ID: nextDeviceId
                        });
                        this._appState.siteIdWidthDeviceId = [siteId, nextDeviceId];
                    });
            }
        }
    }

    /**
     * 获取路由传入的参数ID
     */
    getDeviceIdFromRoute(props) {
        let {match, location} = props;
        let {pathname} = location;
        let routeDeviceId = "";
        if (pathname.length > match.path.length + 1) {
            routeDeviceId = pathname.substr(match.path.length + 1);
        }
        return routeDeviceId;
    }

    querySiteId(deviceId = "") {
        if (deviceId.length > 0) {
            return Ajax.apiPost("/systemmanager/operation/deviceopsettting/device-list", {ID: deviceId})
                .then((d) => {
                    let data = d.data || [];
                    if (data.length > 0) {
                        let device = data[0];
                        return device.SITE_ID || "";
                    } else {
                        return "";
                    }
                });
        } else {
            return Promise.resolve("");
        }
    }

    querySiteDeviceSuppliesTree() {
        let asyncSiteList = Ajax.apiPost("/systemmanager/operation/deviceopsettting/site-list");
        let asyncDeviceList = Ajax.apiPost("/systemmanager/operation/deviceopsettting/device-list");
        // 构建数据树
        return Promise.all([asyncSiteList, asyncDeviceList])
            .then((values) => {
                // 组装数据
                const [d1, d2] = values;
                let siteData = d1.data || [];
                let deviceData = d2.data || [];

                // 全部默认
                let allSiteItem = {value: "", label: "全部站点"};
                let allDeviceItem = {value: "", label: "全部设备"};

                // 根据站点将设备分组
                let devicesBySiteMap = new Map();
                deviceData.forEach((item) => {
                    let siteId = item.SITE_ID;
                    let deviceId = item.ID;
                    let deviceName = item.NAME;

                    if (!devicesBySiteMap.has(siteId)) {
                        devicesBySiteMap.set(siteId, [allDeviceItem]);
                    }
                    let deviceArray = devicesBySiteMap.get(siteId);
                    deviceArray.push({
                        value: deviceId,
                        label: deviceName
                    });
                });

                // 生成数据
                let siteDeviceData = [{...allSiteItem, children: [allDeviceItem]}];
                siteData.forEach((item) => {
                    let siteId = item.ID;
                    let siteName = item.NAME;
                    let deviceList = devicesBySiteMap.get(siteId) || [];
                    siteDeviceData.push({
                        value: siteId,
                        label: siteName,
                        children: deviceList
                    });
                });
                return siteDeviceData;
            });
    }

    onAddClick = () => {
        let dialogState = this._appState.deviceAddState;
        let [siteId, deviceId] = this._appState.siteIdWidthDeviceId;
        dialogState.data.SUPPLIES_ID = [siteId, deviceId, ""];
        dialogState.show();
    };

    onSearchClick = () => {
        let siteIdWidthDeviceId = this._appState.siteIdWidthDeviceId;
        let siteId = siteIdWidthDeviceId[0] || "";
        let deviceId = siteIdWidthDeviceId[1] || "";
        let url = this.props.match.path + "/" + deviceId;
        if (this.props.location.pathname !== url) {
            this.props.history.push(this.props.match.path + "/" + deviceId);
        }
        this.loadData({DEVICE_ID: deviceId, SITE_ID: siteId});
    };

    onEditClick = (text, record) => {
        let dialogState = this._appState.deviceEditState;
        record.SUPPLIES_ID = [record.SITE_ID, record.DEVICE_ID, record.SUPPLIES];
        dialogState.data = record;
        console.log(JSON.stringify(record));
        dialogState.show();
    };

    onDetailClick = (text, record) => {
        let state = this._appState;
        state.deviceDetailState.data = record;
        state.deviceDetailState.show();
    };

    onDeleteClick = (text, record) => {
        Ajax.apiPost("/systemmanager/operation/deviceopsettting/delete", {ID: record.ID})
            .then((d) => {
                Modal.success({
                    title: "提示",
                    content: "删除成功！",
                    okText: "确定"
                });
                this.loadData();
            });
    };

    onSelectChange = (value) => {
        this._appState.siteIdWidthDeviceId = value || ["", ""];
    };

    onEditSuccess = () => {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.loadData();
    };

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.loadData();
    };

    loadData = (params = {DEVICE_ID: "", SITE_ID: ""}) => {
        Ajax.apiPost("/systemmanager/operation/deviceopsettting/list", params)
            .then((d) => {
                this._appState.dataSource = d.data || [];
            });
    };

    filter(inputValue, path) {
        return (
            path.some(option => (option.label)
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) > -1)
        );
    }

    render() {
        const appState = this._appState;
        return (
            <Layout>
                <DeviceOpSettingEditDialog
                    state={appState.deviceAddState}
                    dialogTitle="新增站点"
                    actionURL="/systemmanager/operation/deviceopsettting/create"
                    onSubmitSuccess={this.onAddSuccess}
                />

                <DeviceOpSettingEditDialog
                    state={appState.deviceEditState}
                    dialogTitle="编辑站点"
                    actionURL="/systemmanager/operation/deviceopsettting/update"
                    onSubmitSuccess={this.onEditSuccess}
                />

                <DeviceOpSettingDetailDialog
                    state={appState.deviceDetailState}
                    dialogTitle="站点详情"
                />

                <Layout>
                    <div
                        className={style.row}
                        style={{marginTop: 12}}
                    >
                        <FormItem
                            style={{width: 700}}
                            label="站点/设备"
                        >
                            <Cascader
                                style={{width: "100%"}}
                                value={toJS(this._appState.siteIdWidthDeviceId)}
                                showSearch={{filter: this.filter}}
                                options={toJS(this._appState.siteDeviceSuppliesTree)}
                                onChange={this.onSelectChange}
                                placeholder=""
                            />
                        </FormItem>
                        <FormItem
                            style={{width: 80}}
                        >
                            <Button
                                type="primary"
                                icon="search"
                                onClick={this.onSearchClick}
                            >查询</Button>
                        </FormItem>
                        <FormItem
                            style={{width: 80}}
                        >
                            <Button
                                type="primary"
                                icon="search"
                                onClick={this.onAddClick}
                            >新增</Button>
                        </FormItem>
                    </div>

                    <Table
                        rowKey={record => record.ID}
                        dataSource={toJS(appState.dataSource)}
                        columns={this._columns}
                    />
                </Layout>
            </Layout>
        );
    }
}
