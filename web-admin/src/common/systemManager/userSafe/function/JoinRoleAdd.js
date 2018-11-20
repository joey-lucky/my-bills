import React from "react";
import {autorun, observable} from "mobx";
import {observer} from "mobx-react";
import {Form} from "antd";
import {Ajax} from "../../../unit/ajax";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";
import UsTransfer from "../../../component/UsTransfer";

const FormItem = Form.Item;

class JoinRoleState extends FormDialogState {

    constructor() {
        super();
        autorun(() => {

            if (!this.data.ID) {
                return;
            }

            Ajax.apiPost("/systemmanager/usersafe/function/get-model", {ID: this.data.ID}).then((d) => {

                if (d.data == null) {
                    return;
                }

                if (d.data[0] == null) {
                    return;
                }

                var roles = d.data[0].relationModelMap.BC_ROLE_FUNCTION;

                if (roles != null) {
                    this.userRole = roles.map(item => item.ROLE_ID);
                }
            });
        });
    }

    @observable userRole = [];

}

@observer
class JoinRoleAdd extends FormDialog {

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
        this.actionURL = "/systemmanager/usersafe/function/update";
        this.dialogTitle = "关联角色";

        this.getDataSource();
    }

    static newState() {
        return new JoinRoleState();
    }

    /**
     * 提交前的逻辑
     */
    beforeSubmit(values) {

        let roles = [];

        Object.keys(values.roleId || {}).forEach((i) => {
            let roleid = values.roleId[i];
            roles.push({
                ROLE_ID: roleid
            });
        });

        let data = {
            relationModelMap: {
                BC_ROLE_FUNCTION: roles
            }
        };
        return data;
    }

    /**
     * 获取角色数据源
     */
    getDataSource() {
        Ajax.apiPost("/systemmanager/usersafe/role/list").then((d) => {
            var data = d.data.map(item => ({ID: item.ID, NAME: item.NAME, key: item.ID}));
            this.setState({roleDataSource: data});
        });
    }

    renderForm() {

        var userRole = [];

        for (var i = 0; i < this.props.state.userRole.length; i++) {
            userRole.push(this.props.state.userRole[i]);
        }

        const {getFieldDecorator} = this.props.form;
        var userFiled = getFieldDecorator("roleId", {initialValue: userRole})(<UsTransfer
            label="角色"
            dataSource={this.state.roleDataSource}
        />);

        var labelSpan = {
            span: 4
        };
        var fieldSpan = {
            span: 20
        };

        return (
            <Form>
                <FormItem label="角色" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {userFiled}
                </FormItem>
            </Form>
        );
    }

}

export default Form.create()(JoinRoleAdd);
