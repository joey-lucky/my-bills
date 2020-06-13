import * as React from "react";
import {useEffect, useState} from "react";
import moment from "moment";
import colors from "@res/colors";
import strings from "@res/strings";
import DateItem from "./DateItem";
import PickerFormItem from "./PickerFormItem";
import InputItem from "./InputItem";
import MoneyInput from "./MoneyInput";
import * as styles from "./index.css";
import {billTypeAPI, cardAPI} from "@services/index";
import {RemoteTreePicker} from "@components/remote";
import icons from "@res/icons";
import FormItem from "@components/BaseBillEdit/FormItem";

function useLoadData(props) {
    const [cardList, setCardList] = useState([]);
    const [billTypeList, setBillTypeList] = useState([]);
    const typeCodeMap = {
        [strings.income]: "1",
        [strings.outgoing]: "-1",
        [strings.other]: "0",
    };
    const buildCardTree = (cardList = []) => {
        let groupByUser = {};
        for (let card of cardList) {
            let userName = card.userName;
            if (!(userName in groupByUser)) {
                groupByUser[userName] = [];
            }
            groupByUser[userName].push(card);
        }
        return Object.keys(groupByUser).map(userName => {
            return {
                id: userName,
                name: userName,
                children: groupByUser[userName]
            }
        })
    }

    useEffect(
        () => {
            const billTypeType = typeCodeMap[props.typeName];
            const loadData = async () => {
                let {data: cardList} = await cardAPI.index();
                let {data: billTypeList} = await billTypeAPI.index({type: billTypeType})
                setCardList(buildCardTree(cardList));
                setBillTypeList(billTypeList);
            };
            loadData().then();
        },
        [props.typeName]
    );
    return {cardList, billTypeList}
}

export default function BaseBillEdit(props) {
    const {typeName,value = {}} = props;
    const {cardList, billTypeList} = useLoadData(props);
    const getFieldProps = (id, opt = {}) => {
        opt.initialValue = value[id] || "";
        return props.form.getFieldProps(id, opt);
    };
    let needTarget = typeName === strings.other;
    return (
        <div className={styles.container}>
            <MoneyInput
                {...getFieldProps("money", {
                    rules: [{
                        required: true,
                        message: "请输入金额"
                    }],
                })}
                color={colors.getMoneyColor(typeName)}
            />
            <div className={styles.itemContainer}>
                <FormItem
                    style={{width: "100%", height: "100%"}}
                    align={"center"}
                    label={"类型"}
                    icon={icons.xe321}
                    color={"#8880EF"}
                >
                    <RemoteTreePicker
                        {...getFieldProps("billTypeId", {
                            rules: [{
                                required: true,
                                message: "请选择账单类型"
                            }],
                            initialValue: "51585e30-2cfb-11e9-b803-2fb0ad7f2291"
                        })}
                        style={{width: "100%", height: "100%"}}
                        extra={billTypeList}
                        cols={3}
                    />
                </FormItem>
                <PickerFormItem label={needTarget ? "转出" : "账户"}>
                    <RemoteTreePicker
                        style={{width: "100%", height: "100%"}}
                        {...getFieldProps("cardId", {
                            rules: [{
                                required: true,
                                message: "请选择账户"
                            }],
                            initialValue: "8e5591e0-312e-11e9-b743-2574d7883c40"
                        })}
                        cols={2}
                        extra={cardList}
                        arrow={true}
                    />
                </PickerFormItem>
                {
                    needTarget &&
                    <PickerFormItem label={"转入"}>
                        <RemoteTreePicker
                            style={{width: "100%", height: "100%"}}
                            {...getFieldProps("targetCardId", {
                                rules: [{
                                    required: true,
                                    message: "请选择账户"
                                }],
                            })}
                            cols={2}
                            extra={cardList}
                            arrow={true}
                        />
                    </PickerFormItem>
                }
                <DateItem
                    {...getFieldProps("dateTime", {
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
                    {...getFieldProps("billDesc", {
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
