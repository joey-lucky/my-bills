import * as React from "react";
import {Button, DatePicker, Flex, InputItem, List, Toast} from "antd-mobile";
import {createForm} from 'rc-form';
import {billApi, cardApi, tableController} from "@services/api";
import PickerItem from "@components/PickerItem";
import moment from "moment";
import {globalStyles} from "@global";
import * as PropTypes from "prop-types";
import TopBar from "./TopBar";

@createForm()
export default class BillAdd extends React.Component {
    _defData = {
        date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        bill_type_id: "32291f40-2cfb-11e9-b803-2fb0ad7f2291",
        bill_type: "-1"
    };

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            data: this._defData,
            cardData: [],
            isNew: true,
        }
    }

    componentDidMount() {
        console.log(this.props);
        let id = this.props.match.params.id;
        if (id && id !== "undefined") {
            this.loadBillData(id).then(data => {
                let money = data["money"];
                data.money = Math.abs(money);
                data.bill_type = money >= 0 ? "1" : "-1";
                this.setState({data});
            });
        }
        this.loadCardData().then(data => this.setState({cardData: data}));
    }

    onSaveClick = () => {
        this.props.form.validateFields((error, values) => {
            if (error) {
                Toast.info(Object.values(error)[0].errors[0].message, 2, null, false);
            } else {
                if (values["bill_type"] === "-1") {
                    values["money"] = 0 - values["money"];
                }
                values["date_time"] = moment(values["date_time"]).format("YYYY-MM-DD HH:mm:ss");
                this.saveData(values)
                    .then((d) => {
                        this.props.history.goBack();
                    });
            }
        });
    };

    getFieldProps = (id, opt = {}) => {
        const {form} = this.props;
        const {data} = this.state;
        let value = data[id];
        if (id === "date_time") {
            value = moment(value).toDate();
        }
        opt.initialValue = value;
        return form.getFieldProps(id, opt);
    };

    render() {
        return (
            <Flex
                style={globalStyles.container}
                direction={"column"}
                align={"center"}>
                <TopBar title={"账单新增/编辑"}/>
                <List style={{width: "100%"}}>
                    <PickerItem
                        {...this.getFieldProps("card_id", {rules: [{required: true, message: "请选择卡片类型"}]})}
                        label={"银行卡类型"}
                        cols={2}
                        data={this.state.cardData}
                    />
                    <PickerItem
                        {...this.getFieldProps("bill_type_id", {rules: [{required: true, message: "请选择账单类型"}]})}
                        label={"账单类型"}
                        url={"/wxapp/table/list"}
                        params={{tableName: "bc_bill_type"}}
                        parse={{id: "id", name: "name"}}
                    />
                    <PickerItem
                        {...this.getFieldProps("bill_type", {
                            rules: [{required: true, message: "请选择账单类型"}],
                        })}
                        label={"类型"}
                        data={[{value: "-1", label: "支出"}, {value: "1", label: "收入"}]}
                    />
                    <InputItem
                        {...this.getFieldProps("money", {rules: [{required: true, message: "请输入金额"}]})}
                        type={"money"}
                        extra={"¥"}
                    >金额</InputItem>
                    <DatePicker
                        {...this.getFieldProps("date_time", {
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
                    <InputItem
                        {...this.getFieldProps("bill_desc", {
                            rules: [{required: true, message: "请输入具体明细"}]
                        })}
                        type={"text"}
                        placeholder={"请输入明细"}
                    >明细</InputItem>
                    <Button type={"primary"} onClick={this.onSaveClick}>保存</Button>
                </List>
            </Flex>
        )
    }

    async loadCardData() {
        function parseData(rows) {
            return rows.map((item) => {
                let bean = {
                    value: item["id"],
                    label: item["name"],
                };
                if (item.children) {
                    bean.children = parseData(item.children);
                }
                return bean;
            });
        }

        let d = await cardApi.listGroupByUser();
        let data = d.data || [];
        return parseData(data);
    }

    async loadBillData(id) {
        let d = await tableController.list("bd_bill", {id});
        let data = d.data || [];
        let result = data[0] || {};
        return {...this._defData, ...result}
    }

    async saveData(values) {
        if (this.state.isNew) {
            return await billApi.create(values);
        } else {
            return await billApi.update({...this.state.data, ...values});
        }
    }
}
