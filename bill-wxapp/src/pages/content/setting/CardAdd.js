import * as React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Flex, Icon, InputItem, List, ListView, NavBar, Toast} from "antd-mobile";
import {createForm} from 'rc-form';
import {tableController} from "@services/api";
import PickerItem from "@components/PickerItem";

class AppState {
    @observable initData = {};


    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {

    }

    asyncSaveData(values) {
        return tableController.add("bc_card", values);
    }
}

@createForm()
@observer
export default class BillTypeAdd extends React.Component {
    _appState = new AppState();

    constructor(props) {
        super(props);
    }

    onSaveClick = () => {
        this.props.form.validateFields((error, values) => {
            if (error) {
                Toast.info(Object.values(error)[0].errors[0].message, 2, null, false);
            } else {
                this._appState.asyncSaveData(values)
                    .then((d) => {
                        this.props.history.goBack();
                    });
            }
        });

    };

    render() {
        const {form} = this.props;
        return (
            <Flex
                style={{height: "100%"}}
                direction={"column"}
                align={"center"}>
                <NavBar
                    style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left"/>}
                >{"银行卡 - 新增"}</NavBar>

                <List style={{width: "100%"}}>
                    <PickerItem
                        {...form.getFieldProps("card_type_id", {rules: [{required: true, message: "请选择卡片类型"}]})}
                        params={{tableName: "bc_card_type"}}
                        parse={{id: "id", name: "name"}}
                        label={"卡片类型"}
                        url={"/wxapp/table/list"}/>
                    <PickerItem
                        {...form.getFieldProps("user_id", {
                            rules: [{required: true, message: "请选择账单类型"}],
                        })}
                        label={"用户名"}
                        url={"/wxapp/table/list"}
                        parse={{id: "id", name: "name"}}
                        params={{tableName: "bc_user"}}
                    />
                    <InputItem
                        {...form.getFieldProps("name", {rules: [{required: true, message: "名称不能为空"}]})}
                        autoHeight={true}
                    >名称</InputItem>
                    <Button type={"primary"} onClick={this.onSaveClick}>保存</Button>
                </List>
            </Flex>
        )
    }
}
