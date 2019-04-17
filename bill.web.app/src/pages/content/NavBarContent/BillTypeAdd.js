import * as React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Flex, InputItem, List, ListView, Toast} from "antd-mobile";
import {createForm} from 'rc-form';
import {tableController} from "@services/api";
import TopBar from "./TopBar";

class AppState {
    @observable initData = {};
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
}

@createForm()
@observer
export default class BillTypeAdd extends React.Component {
    _appState = new AppState();

    constructor(props) {
        super(props);
        let locationState = this.props.location.state || {};
        this.state = {
            isUpdate: !!locationState.data,
            data: locationState.data||{},
        };
    }

    onSaveClick = () => {
        this.props.form.validateFields((error, values) => {
            if (error) {
              Toast.info(Object.values(error)[0].errors[0].message, 2, null, false);
            } else {
                let data = {...this.state.data, ...values};
                if (this.state.isUpdate) {
                    tableController.update("bc_bill_type", data)
                        .then((d) => {
                            this.props.history.goBack();
                        });
                } else {
                    tableController.add("bc_bill_type", data)
                        .then((d) => {
                            this.props.history.goBack();
                        });
                }
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
                <TopBar title={"账单类型新增/编辑"}/>
                <List style={{width: "100%"}}>
                    <InputItem
                        {...form.getFieldProps("name",{
                            rules: [{required: true,message:"名称不能为空"}],
                            initialValue:this.state.data["name"]
                        })}
                        autoHeight={true}
                    >名称</InputItem>
                    <Button type={"primary"} onClick={this.onSaveClick}>保存</Button>
                </List>
            </Flex>
        )
    }
}
