import * as React from "react";
import {Flex} from "antd-mobile";
import {createForm} from "rc-form";
import moment from "moment";
import * as PropTypes from "prop-types";
import colors from "@res/colors";
import {billApi} from "../../services/api";
import DateItem from "./DateItem";
import PickerItem from "./PickerItem";
import InputItem from "./InputItem";
import MoneyInput from "./MoneyInput";

@createForm({
    onValuesChange: (props, changedValues, allValues) => {
        props.onChange && props.onChange(allValues);
    }
})
export default class BillEdit extends React.Component {
    static INCOME = "收入";
    static OUTGOING = "支出";
    static TRANSFER = "转账";
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
        // type: PropTypes.oneOf([
        //     this.INCOME,
        //     this.OUTGOING,
        //     this.TRANSFER,
        // ])
    };

    getFieldProps = (id, opt = {}) => {
        let {value = {}} = this.props;
        opt.initialValue = value[id];
        return this.props.form.getFieldProps(id, opt);
    };

    renderCard(type) {
        let needTarget = type === BillEdit.TRANSFER;
        let cardParams = {};
        let targetCardParams = {};
        return (
            <React.Fragment>
                <PickerItem
                    {...this.getFieldProps("cardId", {
                        rules: [{
                            required: true,
                            message: "请选择账户"
                        }],
                        initialValue: "f486edf0-2c75-11e9-ad9d-8b0a6420bc1c"
                    })}
                    cols={2}
                    parse={{id: "userName", name: "userName", children: {id: "id", name: "name"}}}
                    label={needTarget ? "转出" : "账户"}
                    url={billApi.getCardListUrl}
                    params={cardParams}
                />
                {
                    needTarget &&
                    <PickerItem
                        {...this.getFieldProps("targetCardId")}
                        cols={2}
                        parse={{id: "userName", name: "userName", children: {id: "id", name: "name"}}}
                        label={"转入"}
                        url={billApi.getCardListUrl}
                        params={targetCardParams}
                    />
                }
            </React.Fragment>

        );
    }

    renderBillType(type) {
        return (
            <PickerItem
                {...this.getFieldProps("billTypeId", {
                    rules: [{
                        required: true,
                        message: "请选择账单类型"
                    }],
                    initialValue: "51585e30-2cfb-11e9-b803-2fb0ad7f2291"
                })}
                cols={2}
                parse={{id: "typeName", name: "typeName", children: {id: "id", name: "name"}}}
                label={"类型"}
                url={billApi.getBillTypeListUrl}
            />
        );
    }

    renderDateTime(type) {
        return (
            <DateItem
                {...this.getFieldProps("dateTime", {
                    rules: [{
                        required: true,
                        message: "请选择账单类型"
                    }],
                    initialValue: moment("2019-06-25").toDate()
                })}
                label={"日期"}
                mode={"date"}
            />
        );
    }

    renderInput(type) {
        return (
            <InputItem
                {...this.getFieldProps("billDesc")}
                label={"备注"}
            />
        );
    }

    renderMoney(type) {
        let color = {
            [BillEdit.OUTGOING]: colors.outgoing,
            [BillEdit.INCOME]: colors.income,
            [BillEdit.TRANSFER]: colors.title,
        };
        return (
            <MoneyInput
                {...this.getFieldProps("money")}
                color={color[type]}
            />
        );
    }

    render() {
        let {type} = this.props;
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                {this.renderMoney(type)}
                <Flex
                    style={styles.itemContainer}
                    direction={"column"}
                >
                    {this.renderBillType(type)}
                    {this.renderCard(type)}
                    {this.renderDateTime(type)}
                    {this.renderInput(type)}
                </Flex>
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    itemContainer: {
        width: "100%",
        flex: 1,
        height: 0,
        marginTop: "0.5rem",
        paddingLeft: "0.9rem",
    },
};