import * as React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Flex, Icon, InputItem, List, ListView, NavBar, TextareaItem} from "antd-mobile";
import {createForm} from 'rc-form';
import {billApi, tableController} from "@services/api";
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
        return tableController.add("bc_bill_type",values);
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
                {/*<NavBar*/}
                    {/*style={{width: "100%"}}*/}
                    {/*mode="light"*/}
                    {/*icon={<Icon type="left"/>}*/}
                {/*>{"账单类型 - 新增"}</NavBar>*/}

                <List style={{width: "100%"}}>
                    <InputItem
                        {...form.getFieldProps("name",{rules: [{required: true,message:"名称不能为空"}]})}
                        autoHeight={true}
                    >名称</InputItem>
                    <Button type={"primary"} onClick={this.onSaveClick}>保存</Button>
                </List>
            </Flex>
        )
    }
}
