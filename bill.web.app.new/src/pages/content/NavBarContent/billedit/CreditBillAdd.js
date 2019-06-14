import * as React from "react";
import {Button, DatePicker, Flex, InputItem, List, Toast} from "antd-mobile";
import {createForm} from 'rc-form';
import moment from "moment";
import {billApi} from "@services/api";
import PickerItem from "@components/PickerItem";
import {globalStyles} from "@global";
import TopBar from "@components/TopBar";
import UUID from "@utils/UUID";

/**
 * 信用卡账单
 */
@createForm()
export default class CreditBillAdd extends React.Component {
    _defBill = {
        date_time: new Date(),
    };

    constructor(props) {
        super(props);
        let locationState = this.props.location.state || {};
        let locationBill = locationState.data;
        let bill = this._defBill;
        if (locationBill) {
            bill = locationBill;
            let money = bill["money"];
            let dateTime = bill["date_time"];
            bill.date_time = moment(dateTime).toDate();
            bill.money = Math.abs(money);
        }
        let billTransfer = (bill.children && bill.children["bd_bill_transfer"] && bill.children["bd_bill_transfer"][0]) || {};
        this.state = {
            isUpdate: !!locationState.data,
            bill: bill,
            billTransfer: billTransfer,
            cashCardData: [],
            creditCardData: [],
        };
    }

    componentDidMount() {
        billApi.creditBillAdd.getCashCardList().then(d => {
            let data = d.data || [];
            this.setState({
                cashCardData: this.parseDataToPickerData(data)
            });
        });
        billApi.creditBillAdd.getCreditCardList().then(d => {
            let data = d.data || [];
            this.setState({
                creditCardData: this.parseDataToPickerData(data)
            });
        });
    }

    onSaveClick = () => {
        this.props.form.validateFields((error, values) => {
            if (error) {
                Toast.info(Object.values(error)[0].errors[0].message, 2, null, false);
            } else {
                values["money"] = 0 - values["money"];
                values["date_time"] = moment(values["date_time"]).format("YYYY-MM-DD HH:mm:ss");
                let {bill,billTransfer} = this.state;
                billTransfer["target_card_id"] = values["target_card_id"];
                if (this.state.isUpdate) {
                    bill = {...bill, ...values};
                    let params  ={
                        "bd_bill": [bill],
                        "bd_bill_transfer": [billTransfer],
                    };
                    billApi.creditBillAdd.updateBill(params).then(() => this.props.history.goBack());
                } else {
                    let billId = UUID.randomGuid();
                    bill = {...bill, ...values};
                    bill["id"] = billId;
                    bill["bill_type_id"] = "6efb4370-4868-11e9-a5f7-8d7957d89dc7";
                    billTransfer["bill_id"] = billId;
                    let params  ={
                        "bd_bill": [bill],
                        "bd_bill_transfer": [billTransfer],
                    };
                    billApi.creditBillAdd.createBill(params).then(() => this.props.history.goBack());
                }

            }
        });
    };

    getFieldProps = (id, opt = {}) => {
        if (id === "target_card_id") {
            opt.initialValue = this.state.billTransfer[id];
        }else {
            opt.initialValue = this.state.bill[id];
        }
        return this.props.form.getFieldProps(id, opt);
    };

    parseDataToPickerData(data) {
        //按用户分组
        let groupByUser = {};
        data.forEach((item) => {
            let userId = item["user_id"];
            if (!groupByUser[userId]) {
                groupByUser[userId] = [];
            }
            groupByUser[userId].push(item);
        });

        //转换成页面所需的数据
        let pickerData = [];
        Object.values(groupByUser).forEach((item) => {
            let first = item[0];
            pickerData.push({
                value: first["user_id"],
                label: first["user_name"],
                children: item.map((childItem) => {
                    return {
                        ...childItem,
                        value: childItem.id,
                        label: childItem.name,
                    }
                })
            })
        });
        return pickerData;
    }

    render() {
        let title = this.state.isUpdate ? "账单编辑" : "账单新增";
        let buttonStr = this.state.isUpdate ? "编辑" : "保存";
        return (
            <Flex
                style={globalStyles.container}
                direction={"column"}
                align={"center"}>
                <TopBar title={title}/>
                <List style={{width: "100%"}}>
                    <PickerItem
                        {...this.getFieldProps("target_card_id", {rules: [{required: true, message: "请选择信用卡"}]})}
                        label={"信用卡"}
                        cols={2}
                        data={this.state.creditCardData}
                    />
                    <PickerItem
                        {...this.getFieldProps("card_id", {rules: [{required: true, message: "请选择卡片类型"}]})}
                        label={"银行卡"}
                        cols={2}
                        data={this.state.cashCardData}
                    />
                    <List.Item extra={"信用卡还款"}>账单类型</List.Item>
                    <InputItem
                        {...this.getFieldProps("money", {rules: [{required: true, message: "请输入金额"}]})}
                        type={"money"}
                        extra={"¥"}
                    >金额</InputItem>
                    <DatePicker
                        {...this.getFieldProps("date_time", {
                            rules: [{required: true, message: "请选择时间"}]
                        })}
                        mode={"date"}
                    >
                        <List.Item
                            arrow="horizontal"
                            wrap={true}
                        >
                            日期时间
                        </List.Item>
                    </DatePicker>
                    <InputItem
                        {...this.getFieldProps("bill_desc", {
                            rules: [{required: true, message: "请输入具体明细"}]
                        })}
                        type={"text"}
                        placeholder={"请输入明细"}
                    >明细</InputItem>
                    <Button type={"primary"} onClick={this.onSaveClick}>{buttonStr}</Button>
                </List>
            </Flex>
        )
    }
}
