import React from "react";
import {autorun, observable} from "mobx";
import {observer} from "mobx-react";
import {Form} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import {Ajax} from "@utils/ajax";
import UsTransfer from "@components/UsTransfer";

const FormItem = Form.Item;

class JoinUserState extends FormDialogState {

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

                var users = d.data[0].relationModelMap.BC_ROLE_USER;

                if (users != null) {
                    this.roleUser = users.map(item => item.USER_ID);
                }

            });
        });
    }

    @observable roleUser = [];

}

@observer
class JoinUserAdd extends FormDialog {

    static newState() {
        return new JoinUserState();
    }

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
        this.actionURL = "/systemmanager/usersafe/role/update";
        this.loadUserPromise = this.getDataSource();
        this.dialogTitle = "关联用户";
    }

    componentWillUnmount() {
        if (this.loadUserPromise) {
            this.loadUserPromise.cancel("组件卸载");
        }
    }

    /**
     * 提交前的逻辑
     */
    beforeSubmit(values) {

        var users = [];
        Object.keys(values.userId)
            .forEach((key) => {
                users.push({
                    USER_ID: values.userId[key]
                });
            });
        var data = {
            relationModelMap: {
                BC_ROLE_USER: users
            }
        };

        return data;
    }

    /**
     * 获取用户数据源
     */
    getDataSource() {
        return Ajax.apiPost("/systemmanager/usersafe/user/list").then((d) => {
            var data = d.data.map(item => ({ID: item.ID, NAME: item.REAL_NAME, key: item.ID}));
            this.setState({userDataSource: data});
        });
    }

    renderForm() {

        var roleUser = [];

        for (var i = 0; i < this.props.state.roleUser.length; i++) {
            roleUser.push(this.props.state.roleUser[i]);
        }

        const {getFieldDecorator} = this.props.form;
        var userFiled = getFieldDecorator("userId", {initialValue: roleUser})(<UsTransfer
            dataSource={this.state.userDataSource}
        />);

        var labelSpan = {
            span: 4
        };
        var fieldSpan = {
            span: 20
        };

        return (
            <Form>
                <FormItem label="用户" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {userFiled}
                </FormItem>
            </Form>
        );
    }

}

export default Form.create()(JoinUserAdd);
