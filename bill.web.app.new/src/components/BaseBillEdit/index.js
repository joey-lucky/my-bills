import * as React from "react";
import {Flex} from "antd-mobile";
import moment from "moment";
import * as PropTypes from "prop-types";
import colors from "@res/colors";
import strings from "@res/strings";
import {baseBillEditApi} from "../../services/api";
import DateItem from "./DateItem";
import PickerItem from "./PickerItem";
import InputItem from "./InputItem";
import MoneyInput from "./MoneyInput";
import * as styles from "./index.css";

export default class BaseBillEdit extends React.Component {
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
        style: PropTypes.object,
        form: PropTypes.any,
        typeName: PropTypes.string,
    };

    static typeCodeMap = {
        [strings.income]: "1",
        [strings.outgoing]: "-1",
        [strings.other]: "0",
    };

    getFieldProps = (id, opt = {}) => {
        let {value = {}} = this.props;
        opt.initialValue = value[id] || "";
        return this.props.form.getFieldProps(id, opt);
    };

    render() {
        const {typeName} = this.props;
        let needTarget = typeName === strings.other;
        let cardParams = {};
        let targetCardParams = {};
        return (
            <div className={styles.container}>
                <MoneyInput
                    {...this.getFieldProps("money", {
                        rules: [{
                            required: true,
                            message: "请输入金额"
                        }],
                    })}
                    color={colors.getMoneyColor(typeName)}
                />
                <div className={styles.itemContainer}>
                    <PickerItem
                        {...this.getFieldProps("billTypeId", {
                            rules: [{
                                required: true,
                                message: "请选择账单类型"
                            }],
                            initialValue: "51585e30-2cfb-11e9-b803-2fb0ad7f2291"
                        })}
                        url={baseBillEditApi.getBillTypeListUrl}
                        params={{type: BaseBillEdit.typeCodeMap[typeName]}}
                        parse={{id: "typeName", name: "typeName", children: {id: "id", name: "name"}}}
                        cols={2}
                        label={"类型"}
                    />
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
                    <InputItem
                        {...this.getFieldProps("billDesc", {
                            rules: [{
                                required: true,
                                message: "请输入账单明细"
                            }],
                        })}
                        label={"明细"}
                    />
                </div>
            </div>
        );
    }
}
