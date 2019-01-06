import React from "react";
import {observer} from "mobx-react";
import {Button, DatePicker, Form, Input, Layout} from "antd";
import * as PropTypes from "prop-types";
import moment from "moment";
import * as style from "./OpCarReportDayList.css";
import TableSelect from "@components/TableSelect"

const FormItem = props => (
    <div
        className={style.form}
        style={props.style}
    >
        {props.label && <div className={style.label}>{props.label + "："}</div>}
        <div className={style.item}>{props.children}</div>
    </div>
);
FormItem.propTypes = {
    style: PropTypes.any,
    label: PropTypes.any,
    children: PropTypes.any
};


class AppState {
    data = {
        DATATIME: [moment().add(-1, "days").format("YYYY-MM-DD") + " 00:00:00", moment().add(-1, "days").format("YYYY-MM-DD") + " 23:59:59"],
        GROUP_ID: "",
        CAR_NO: ""
    };
}

@Form.create()
@observer
export default class OpCarReportDayFilter extends React.Component {
    static newState() {
        return new AppState();
    }

    static propTypes = {
        state: PropTypes.any,
        form: PropTypes.any,
        onSearchClick: PropTypes.any
    };

    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;
        let value = state.data[id];
        if (id === "DATATIME") {
            options.initialValue = [moment(value[0]), moment(value[1])];
        } else {
            options.initialValue = value;
        }
        return form.getFieldDecorator(id, options);
    };

    getFieldsValues = () => {
        const {form} = this.props;
        let values = form.getFieldsValue();
        // 对时间格式进行转换
        let dateTimes = values.DATATIME;

        if (dateTimes[0] && dateTimes[1]) {
            dateTimes = [dateTimes[0].format("YYYY-MM-DD") + " 00:00:00", dateTimes[1].format("YYYY-MM-DD") + " 23:59:59"];
        }

        return {
            ...values,
            DATATIME: dateTimes
        };
    };

    onSearchClick = () => {
        const {state, onSearchClick} = this.props;
        let values = this.getFieldsValues();
        state.data = values;
        onSearchClick && onSearchClick(values);
    };

    render() {
        return (
            <Layout style={{marginTop: 20}}>
                <div className={style.row}>
                    <FormItem
                        style={{width: 300}}
                        label="运维组"
                    >
                        {this.getFieldDecorator("GROUP_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                url="/systemmanager/operation/group/list"
                                parse={{CODE: "ID", VALUE: "NAME"}}
                                width="100%"
                            />
                        )}
                    </FormItem>

                    <FormItem
                        style={{width: 400}}
                        label="记录时间"
                    >
                        {this.getFieldDecorator("DATATIME")(
                            <DatePicker.RangePicker
                                format="YYYY-MM-DD"
                                onChange={this.onStartDateChanged}
                            />
                        )}
                    </FormItem>

                    <FormItem
                        style={{width: 80}}
                    >
                        <Button
                            type="primary"
                            icon="search"
                            onClick={this.onSearchClick}
                        >查询</Button>
                    </FormItem>
                </div>
                <div className={style.row}>
                    <FormItem
                        style={{width: 300}}
                        label="车牌号"
                    >
                        {this.getFieldDecorator("CAR_NO")(<Input/>)}
                    </FormItem>
                </div>
            </Layout>
        );
    }
}
