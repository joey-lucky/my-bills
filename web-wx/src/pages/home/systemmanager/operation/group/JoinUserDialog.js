/**
 * 运维组关联用户
 */
import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Col, Form, Modal, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import {Ajax} from "@utils/ajax";
import UsTransfer from "@components/UsTransfer";

const FormItem = Form.Item;

class AppState extends FormDialogState {
    @observable selectUserList = [];
    @observable transferUserList = [];
    groupModel = {};

    show(group) {
        super.show();
        this.selectUserList = [];
        let modelPromise = Ajax.apiPost("/systemmanager/operation/group/get-model", {ID: group.ID});
        let userPromise = Ajax.apiPost("/systemmanager/operation/group/get-join-user-list", {GROUP_ID: group.ID});
        Promise.all([modelPromise, userPromise])
            .then((values) => {
                let modelData = values[0];
                let userData = values[1];

                this.groupModel = modelData.data[0];
                let users = this.groupModel.relationModelMap.BC_OP_GROUP_USER || [];
                this.selectUserList = users.map(item => item.USER_ID);

                let userList = userData.data || [];
                this.transferUserList = userList.map((item, index) => ({
                    ID: item.ID,
                    NAME: item.REAL_NAME,
                    key: item.ID
                }));
            });
    }
}

@Form.create()
@observer
export default class JoinUserDialog extends FormDialog {

    static newState() {
        return new AppState();
    }

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
    }


    /**
     * 提交前的逻辑
     */
    beforeSubmit(values) {
        const {state} = this.props;
        let userIdArray = values.userIds;
        let users = userIdArray.map((item, index) => ({USER_ID: item}));
        return {
            ...state.groupModel,
            relationModelMap: {
                BC_OP_GROUP_USER: users
            }
        };
    }

    onSubmitSuccess(msg) {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
    }

    renderForm() {
        const {state, form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form layout="inline">
                <Row>
                    <Col span={24}>
                        <FormItem label="">
                            {getFieldDecorator("userIds", {initialValue: toJS(state.selectUserList)})(
                                <UsTransfer dataSource={state.transferUserList}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}
