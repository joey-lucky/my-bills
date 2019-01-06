import React from "react";
import {autorun, action, observable, toJS, runInAction} from "mobx";
import {observer} from "mobx-react";
import {Form} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import {Ajax} from "@utils/ajax";
import UsTransfer from "@components/UsTransfer";

const FormItem = Form.Item;

class AppState extends FormDialogState {
    @observable selectRoles = [];
    @observable roleList = [];

    show(data) {
        super.show();
        this.data = data;
        this.asyncGetData(data.ID)
            .then(({selectRoles, roleList}) => {
                runInAction(()=>{
                    this.selectRoles = selectRoles;
                    this.roleList = roleList;
                });
            });
    }

    async asyncGetData(userId) {
        let loadUserResult = await Ajax.apiPost("/systemmanager/usersafe/user/get-model", {ID: userId});
        let loadRoleResult = await Ajax.apiPost("/systemmanager/usersafe/role/list");

        let userData = loadUserResult.data[0] || {relationModelMap: {BC_ROLE_USER: []}};
        let roleSet = new Set();
        let roleList = loadRoleResult.data.map(item => {
            roleSet.add(item.ID);
            return {ID: item.ID, NAME: item.NAME, key: item.ID};
        });
        let selectRoles = userData.relationModelMap.BC_ROLE_USER;
        //将Role关联表转换成ROLE_ID数组，并过滤筛选
        selectRoles = selectRoles.map((item) => item["ROLE_ID"])
            .filter((item) => roleSet.has(item));
        return {selectRoles, roleList};
    }
}

@Form.create()
@observer
export default class JoinRoleAdd extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 650;
        this.actionURL = "/systemmanager/usersafe/user/update";
        this.dialogTitle = "关联角色";
    }

    static newState() {
        return new AppState();
    }

    /**
     * 提交前的逻辑
     */
    beforeSubmit(values) {
        const {roleId = []} = values;
        let roles = roleId.map((item) => {
            return {ROLE_ID: item}
        });
        return {
            relationModelMap: {
                BC_ROLE_USER: roles
            }
        };
    }

    renderForm() {
        const {state, form} = this.props;

        return (
            <Form>
                <FormItem
                    label="角色"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 20}}>
                    {form.getFieldDecorator("roleId", {initialValue: toJS(state.selectRoles)})(
                        <UsTransfer
                            label="角色"
                            dataSource={toJS(state.roleList)}
                        />
                    )}
                </FormItem>
            </Form>
        );
    }
}
