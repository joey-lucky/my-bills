import * as React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, DatePicker, Flex, Icon, InputItem, List, NavBar, TextareaItem, Toast} from "antd-mobile";
import {createForm} from 'rc-form';
import {billAdd} from "@services/api";
import PickerItem from "@components/PickerItem";
import * as moment from "moment";

class AppState {
    @observable initData = {
        date_time: new Date(),
    };

    asyncSaveData(values) {
        return billAdd.create(values);
    }
}

@createForm()
@observer
export default class BillAdd extends React.Component {
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
                values["date_time"] = moment(values["date_time"]).format("YYYY-MM-DD HH:mm:ss");
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
                        {...form.getFieldProps("card_id", {rules: [{required: true, message: "请选择卡片类型"}]})}
                        params={{tableName: "bc_card"}}
                        parse={{id: "id", name: "name"}}
                        label={"卡片类型"}
                        url={"/wxapp/table/list"}/>
                    <PickerItem
                        {...form.getFieldProps("bill_type_id", {
                            rules: [{required: true, message: "请选择账单类型"}],
                        })}
                        label={"账单类型"}
                        url={"/wxapp/table/list"}
                        params={{tableName: "bc_bill_type"}}
                        parse={{id: "id", name: "name"}}/>
                    <InputItem
                        {...form.getFieldProps("money", {rules: [{required: true, message: "请输入金额"}]})}
                        type={"money"}
                        clear={true}
                        extra="¥"
                    >金额</InputItem>
                    <DatePicker
                        {...form.getFieldProps("date_time", {
                            initialValue: new Date(),
                            rules: [{required: true, message: "请选择时间"}]
                        })}
                        mode={"datetime"}
                    >
                        <List.Item
                            arrow="horizontal"
                            wrap={true}
                        >
                            日期时间
                        </List.Item>
                    </DatePicker>
                    <TextareaItem
                        {...form.getFieldProps("bill_desc",{
                            rules: [{required: true, message: "请输入具体明细"}]
                        })}
                        title="明细"
                        autoHeight={true}
                    />
                    <Button type={"primary"} onClick={this.onSaveClick}>保存</Button>
                </List>
            </Flex>
        )
    }
}
