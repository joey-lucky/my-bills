import * as React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Flex, Icon, InputItem, List, ListView, NavBar} from "antd-mobile";
import {createForm} from 'rc-form';
import InputItemSelect from "@components/InputItemSelect";
import {addTableData} from "@services/api";
import {TestContext} from "../index";
import * as PropTypes from "prop-types";

class AppState {
    @observable initData = {

    };


    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {

    }

    asyncSaveData(values) {
        return addTableData("bd_bill", values);
    }
}

@createForm()
@observer
export default class AddBillPage extends React.Component {


    _appState = new AppState();
    constructor(props,context){
        super(props,context);
    }
    onSaveClick = () => {
        const {form} = this.props;
        let values = form.getFieldsValue();
        this._appState.asyncSaveData(values)
            .then((d) => {
                this.props.history.push("/home");
            });
    };

    render() {
        console.log(this.context.propA);
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
                    rightContent={<span onClick={this.onAddClick}>新增</span>}
                >新增账单</NavBar>

                <List style={{width: "100%"}}>
                    <InputItemSelect
                        {...form.getFieldProps("card_id")}
                        url={"/table/list"}
                        params={{tableName: "bc_card"}}
                        parse={{CODE: "id", VALUE: "name"}}>
                        卡片类型
                    </InputItemSelect>

                    <InputItemSelect
                        {...form.getFieldProps("bill_type_id")}
                        url={"/table/list"}
                        params={{tableName: "bc_bill_type"}}
                        parse={{CODE: "id", VALUE: "name"}}>
                        账单类型
                    </InputItemSelect>

                    <InputItem
                        {...form.getFieldProps("money")}
                        type={"number"}
                        clear={true}
                        extra="¥"
                    >金额</InputItem>

                    <InputItem
                        {...form.getFieldProps("bill_desc")}
                        type={"text"}
                        multiple={true}
                        clear={true}
                    >详情</InputItem>

                    <Button type={"primary"} onClick={this.onSaveClick}>保存</Button>
                </List>
            </Flex>
        )
    }
}
