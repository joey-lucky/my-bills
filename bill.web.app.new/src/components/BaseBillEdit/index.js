import * as React from "react";
import {Flex} from "antd-mobile";
import moment from "moment";
import * as PropTypes from "prop-types";
import colors from "@res/colors";
import {baseBillEditApi} from "../../services/api";
import DateItem from "./DateItem";
import PickerItem from "./PickerItem";
import InputItem from "./InputItem";
import MoneyInput from "./MoneyInput";
import strings from "@res/strings";

export default class BaseBillEdit extends React.Component {
    static TRANSFER = "其它";

    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
        style: PropTypes.object,
    };

    getFieldProps = (id, opt = {}) => {
        return this.props.form.getFieldProps(id, opt);
    };

    renderCard(type) {
        let needTarget = type === strings.other;
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
                    url={baseBillEditApi.getCardListUrl}
                    params={cardParams}
                />
                {
                    needTarget &&
                    <PickerItem
                        {...this.getFieldProps("targetCardId")}
                        cols={2}
                        parse={{id: "userName", name: "userName", children: {id: "id", name: "name"}}}
                        label={"转入"}
                        url={baseBillEditApi.getCardListUrl}
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
                url={baseBillEditApi.getBillTypeListUrl}
                params={{typeName:type}}
                parse={{id: "typeName", name: "typeName", children: {id: "id", name: "name"}}}
                cols={2}
                label={"类型"}
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
                {...this.getFieldProps("billDesc", {
                    rules: [{
                        required: true,
                        message: "请输入账单备注"
                    }],
                })}
                label={"备注"}
            />
        );
    }

    renderMoney(type) {
        return (
            <MoneyInput
                {...this.getFieldProps("money", {
                    rules: [{
                        required: true,
                        message: "请输入金额"
                    }],
                })}
                color={colors.getMoneyColor(type)}
            />
        );
    }

    renderContent(type) {
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