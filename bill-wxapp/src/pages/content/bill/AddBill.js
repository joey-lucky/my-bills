import * as React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Flex, Icon, InputItem, List, ListView, NavBar, TextareaItem} from "antd-mobile";
import {createForm} from 'rc-form';
import {billAdd} from "@services/api";
import PickerItem from "@components/PickerItem";
import {Toast}  from "antd-mobile";

class AppState {
    @observable initData = {};


    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {

    }

    asyncSaveData(values) {
        return billAdd.create(values);
    }
}

@createForm()
@observer
export default class AddBill extends React.Component {
    _appState = new AppState();

    constructor(props) {
        super(props);
    }

    onSaveClick = () => {
        this.props.form.validateFields((error, values) => {
            if (error) {
              Toast.info(Object.values(error)[0].errors[0].message, 2, null, false);
            } else {
                console.log(values);
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
                style={{height: "100%", backgroundColor: "rgba(0,0,0,0.1)"}}
                direction={"column"}
                align={"center"}>
                <NavBar
                    style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={() => this.props.history.goBack()}
                >账单新增</NavBar>

                <List style={{width: "100%"}}>
                    <PickerItem
                        {...form.getFieldProps("card_id",{rules: [{required: true,message:"请选择卡片类型"}]})}
                        params={{tableName: "bc_card"}}
                        parse={{id: "id", name: "name"}}
                        label={"卡片类型"}
                        url={"/wxapp/table/list"}/>
                    <PickerItem
                        {...form.getFieldProps("bill_type_id",{rules: [{required: true,message:"请选择账单类型"}]})}
                        label={"账单类型"}
                        url={"/wxapp/table/list"}
                        params={{tableName: "bc_bill_type"}}
                        parse={{id: "id", name: "name"}}/>
                    <InputItem
                        {...form.getFieldProps("money",{rules: [{required: true,message:"请输入金额"}]})}
                        type={"money"}
                        clear={true}
                        extra="¥"
                    >金额</InputItem>
                    <TextareaItem
                        {...form.getFieldProps("bill_desc")}
                        title="明细"
                        autoHeight={true}
                    />
                    <Button type={"primary"} onClick={this.onSaveClick}>保存</Button>
                </List>
            </Flex>
        )
    }
}
