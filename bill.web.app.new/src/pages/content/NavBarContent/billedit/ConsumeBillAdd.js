import * as React from "react";
import {Button, DatePicker, Flex, InputItem, List, Toast} from "antd-mobile";
import {createForm} from 'rc-form';
import {billApi} from "@services/api";
import PickerItem from "@components/PickerItem";
import moment from "moment";
import {globalStyles} from "@global";
import TopBar from "@components/TopBar";
import UUID from "@utils/UUID";

/**
 * 收入账单
 */
@createForm()
export default class ConsumeBillAdd extends React.Component {
    constructor(props) {
        super(props);
        let id = this.props.match.params.id;
        let isUpdate = !!id;
        let bill = {id: id};
        if (!isUpdate) {
            bill.billTypeId = "32291f40-2cfb-11e9-b803-2fb0ad7f2291";
            bill.dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        }
        this.state = {
            isUpdate,
            bill,
            cardData: [],
            billTypeData: [],
        };
    }

    componentDidMount() {
        if (this.state.isUpdate) {
            let id = this.props.match.params.id;
            billApi.billList.getBillEntity(id).then(d => {
                let data = d.data && d.data[0];
                this.setState({bill: data})
            });
        }
        billApi.consumeBillAdd.getCardList().then(d => {
            let data = d.data || [];
            this.setState({
                cardData: this.parseDataToPickerData(data)
            });
        });
        billApi.consumeBillAdd.getBillTypeList().then(d => {
            let data = d.data || [];
            data.forEach(item => {
                item.value = item.id;
                item.label = item.name;
            });
            this.setState({
                billTypeData: data
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
                if (this.state.isUpdate) {
                    let bill = {...this.state.bill, ...values};
                    let params = {
                        "bd_bill": [bill],
                    };
                    billApi.consumeBillAdd.updateBill(params).then(() => this.props.history.goBack());
                } else {
                    let bill = {...this.state.bill, ...values};
                    bill["id"] = UUID.randomGuid();
                    let params = {
                        "bd_bill": [bill],
                    };
                    billApi.consumeBillAdd.createBill(params).then(() => this.props.history.goBack());
                }
            }
        });
    };

    getFieldProps = (id, opt = {}) => {
        if (id === "money") {
            opt.initialValue = Math.abs(this.state.bill[id]);
        }else if (id === "dateTime") {
            opt.initialValue = moment(this.state.bill[id]).toDate();
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
                        {...this.getFieldProps("cardId", {rules: [{required: true, message: "请选择卡片类型"}]})}
                        label={"银行卡类型"}
                        cols={2}
                        data={this.state.cardData}
                    />
                    <PickerItem
                        {...this.getFieldProps("billTypeId", {rules: [{required: true, message: "请选择账单类型"}]})}
                        label={"账单类型"}
                        data={this.state.billTypeData}
                    />
                    <InputItem
                        {...this.getFieldProps("money", {rules: [{required: true, message: "请输入金额"}]})}
                        type={"money"}
                        extra={"¥"}
                    >金额</InputItem>
                    <DatePicker
                        {...this.getFieldProps("dateTime", {
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
                        {...this.getFieldProps("billDesc", {
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
