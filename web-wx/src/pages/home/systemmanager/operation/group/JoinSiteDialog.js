import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import UsTransfer from "@components/UsTransfer";
import {Ajax} from "@utils/ajax";

class AppState extends FormDialogState {
    @observable selectSiteList = [];
    @observable transferSiteList = [];
    groupModel = {};

    show = (group) => {
        super.show();
        this.selectSiteList = [];
        let modelPromise = Ajax.apiPost("/systemmanager/operation/group/get-model", {ID: group.ID});
        let sitePromise = Ajax.apiPost("/systemmanager/operation/group/get-join-site-list", {GROUP_ID: group.ID});
        Promise.all([modelPromise, sitePromise]).then((values) => {
            let modelData = values[0];
            let siteData = values[1];
            this.groupModel = modelData.data[0];
            let sites = this.groupModel.relationModelMap.BC_OP_GROUP_SITE || [];
            this.selectSiteList = sites.map(item => item.SITE_ID);

            let data = siteData.data || [];
            this.transferSiteList = data.map(item => ({NAME: item.NAME, key: item.ID}));

        });
    };
}

@Form.create()
@observer
export default class JoinSiteDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 870;
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        const {state} = this.props;
        let siteIdArray = values.siteIds || [];
        let sites = siteIdArray.map(item => ({
            SITE_ID: item
        }));
        return {
            ...state.groupModel,
            relationModelMap: {
                BC_OP_GROUP_SITE: sites
            }
        };
    }

    renderForm() {
        const {state, form} = this.props;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={24}>
                        {form.getFieldDecorator("siteIds", {initialValue: toJS(state.selectSiteList)})(
                            <UsTransfer
                                listStyle={{width: 360, height: 400}}
                                dataSource={state.transferSiteList}
                            />
                        )}
                    </Col>
                </Row>
            </Form>
        );
    }
}
