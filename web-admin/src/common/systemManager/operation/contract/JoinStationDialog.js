import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";
import UsTransfer from "../../../component/UsTransfer";
import {Ajax} from "../../../unit/ajax";

class AppState extends FormDialogState {
    @observable siteList = [];
    @observable groupSiteList = [];
    @observable data = {};


    show = () => {
        super.show();
        this.getGroupModel();
        this.loadSiteData();
    };

    loadSiteData = () => {
        Ajax.apiPost("/systemmanager/ent/setting/site/list")
            .then((d) => {
                let data = d.data || [];
                this.siteList = data.map(item => ({...item, key: item.ID}));
            });
    };

    getGroupModel() {
        Ajax.apiPost("/systemmanager/operation/contract/get-model", {ID: this.data.ID})
            .then((d) => {
                this.data = d.data[0];
            });
    }
}

@observer
class JoinStationDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/operation/contract/update";
        this.dialogWidth = 750;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(value) {
        const BC_OP_CONTRACT_SITE = value.BC_OP_CONTRACT_SITE.map(item => ({
            SITE_ID: item
        }));
        return {
            relationModelMap: {
                BC_OP_CONTRACT_SITE: BC_OP_CONTRACT_SITE
            }
        };
    }

    renderForm() {
        const {state} = this.props;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={20}>
                        {this.getFieldDecorator("BC_OP_CONTRACT_SITE")(
                            <UsTransfer
                                dataSource={toJS(state.siteList)}
                            />
                        )}
                    </Col>
                </Row>
            </Form>
        );
    }

    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;
        if (state.data && state.data.relationModelMap &&
            state.data.relationModelMap.BC_OP_CONTRACT_SITE) {
            let BC_OP_CONTRACT_SITE = state.data.relationModelMap.BC_OP_CONTRACT_SITE;
            options.initialValue = BC_OP_CONTRACT_SITE.map(item => item.SITE_ID);
        } else {
            options.initialValue = [];
        }
        return form.getFieldDecorator(id, options);
    };
}

export default Form.create()(JoinStationDialog);
