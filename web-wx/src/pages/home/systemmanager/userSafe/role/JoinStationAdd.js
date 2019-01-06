import React from "react";
import {autorun, observable} from "mobx";
import {observer} from "mobx-react";
import {Form} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import {Ajax} from "@utils/ajax";
import UsTransfer from "@components/UsTransfer";

const FormItem = Form.Item;

class AppState extends FormDialogState {

    constructor() {
        super();
        autorun(() => {

            if (!this.data.ID) {
                return;
            }

            Ajax.apiPost("/systemmanager/usersafe/role/get-model", {ID: this.data.ID}).then((d) => {

                if (d.data == null) {
                    return;
                }

                if (d.data[0] == null) {
                    return;
                }

                var stations = d.data[0].relationModelMap.BC_ROLE_SITE;

                this.roleStations = stations.map(item => item.SITE_ID);
            });
        });
    }

    @observable roleStations = [];

}

@observer
class JoinStationAdd extends FormDialog {

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
        this.actionURL = "/systemmanager/usersafe/role/update";
        this.dialogTitle = "关联站点";
        this.loadSitePromise = this.getDataSource();
    }

    static newState() {
        return new AppState();
    }

    componentWillUnmount() {
        if (this.loadSitePromise) {
            this.loadSitePromise.cancel("组件卸载");
        }
    }

    /**
     * 提交前的逻辑
     */
    beforeSubmit(values) {
        var stations = [];
        Object.keys(values.stationId || {})
            .forEach((key) => {
                stations.push({
                    SITE_ID: values.stationId[key]
                });
            });
        var data = {
            relationModelMap: {
                BC_ROLE_SITE: stations
            }
        };
        return data;
    }

    /**
     * 获取站点数据源
     */
    getDataSource() {
        return Ajax.apiPost("/systemmanager/ent/setting/site/list").then((d) => {
            var data = d.data.map(item => ({ID: item.ID, NAME: item.NAME, key: item.ID}));
            this.setState({stationDataSource: data});
        });
    }

    renderForm() {

        var roleStations = [];

        for (var i = 0; i < this.props.state.roleStations.length; i++) {
            roleStations.push(this.props.state.roleStations[i]);
        }

        const {getFieldDecorator} = this.props.form;
        var stationFiled = getFieldDecorator("stationId", {initialValue: roleStations})(<UsTransfer
            dataSource={this.state.stationDataSource}
        />);

        var labelSpan = {
            span: 4
        };

        var fieldSpan = {
            span: 20
        };

        return (
            <Form>
                <FormItem label="站点" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {stationFiled}
                </FormItem>
            </Form>
        );
    }

}

export default Form.create()(JoinStationAdd);
