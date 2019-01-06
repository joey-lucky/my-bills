import React from "react";
import {autorun, observable} from "mobx";
import {observer} from "mobx-react";
import {Form} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import {Ajax} from "@utils/ajax";
import UsTree from "./UsTree";

const FormItem = Form.Item;

class JoinFunctionState extends FormDialogState {

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

                var functions = d.data[0].relationModelMap.BC_ROLE_FUNCTION;

                this.roleFunctions = functions.map(item => item.FUNCTION_ID);
            });
        });
    }

    @observable roleFunctions = [];

}

@observer
class JoinFunctionAdd extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/usersafe/role/update";
        this.loadFunctionPromise = this.getAllFunction();
        this.dialogTitle = "关联功能";
    }

    static newState() {
        return new JoinFunctionState();
    }

    /**
     * 提交前的逻辑
     */
    beforeSubmit(values) {
        let functions = [];
        Object.keys(values.functionId || {})
            .forEach((key) => {
                functions.push({
                    FUNCTION_ID: values.functionId[key]
                });
            });

        let data = {
            relationModelMap: {
                BC_ROLE_FUNCTION: functions
            }
        };
        return data;
    }

    onSubmitSuccess(msg) {
    }

    componentWillUnmount() {
        if (this.loadFunctionPromise) {
            this.loadFunctionPromise.cancel("组件卸载");
        }
    }

    /**
     * 获取所有功能数据
     */
    getAllFunction() {

        var me = this;

        return Ajax.apiPost("/systemmanager/usersafe/function/list", null, false).then((d) => {
            me.setState({
                functions: d.data
            });
        });
    }

    renderForm() {

        const {getFieldDecorator} = this.props.form;
        var functionFiled = getFieldDecorator("functionId", {initialValue: this.props.state.roleFunctions})(<UsTree
            dataSource={this.state.functions}
        />);

        var labelSpan = {
            span: 6
        };
        var fieldSpan = {
            span: 18
        };

        return (
            <Form>
                <FormItem label="功能" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {functionFiled}
                </FormItem>
            </Form>
        );
    }

}

export default Form.create()(JoinFunctionAdd);
