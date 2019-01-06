import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, DatePicker, Form, Layout} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import * as style from "./TaskPlanList.css";
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
    @observable data = {
        START_TIME: null,
        END_TIME: null,
        GROUP_ID: "",
        SITE_ID: ""
    };
}

@Form.create()
@observer
export default class TaskPlanFilter extends React.Component {
    static propTypes = {
        onSearchClick: PropTypes.any,
        state: PropTypes.any,
        form: PropTypes.any,
        onAddClick: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    onSearchClick = () => {
        const {onSearchClick, state} = this.props;
        state.data = this.getFieldsValues();
        onSearchClick && onSearchClick(state.data);
    };

    getFieldsValues = () => {
        const {form} = this.props;
        let values = form.getFieldsValue();
        let resultValue = {...values};
        // 对时间格式进行转换
        let startTime = values.START_TIME;
        if (startTime && startTime.length === 2) {
            resultValue.START_TIME = [
                startTime[0].format("YYYY-MM-DD hh:mm:ss"),
                startTime[1].format("YYYY-MM-DD hh:mm:ss")
            ];
        } else {
            resultValue.START_TIME = [];
        }
        let endTime = values.END_TIME;
        if (endTime && endTime.length === 2) {
            resultValue.END_TIME = [
                endTime[0].format("YYYY-MM-DD hh:mm:ss"),
                endTime[1].format("YYYY-MM-DD hh:mm:ss")
            ];
        } else {
            resultValue.END_TIME = [];
        }
        return resultValue;
    };

    onAddClick = () => {
        const {onAddClick} = this.props;
        onAddClick && onAddClick();
    };

    onGroupSelect = (value) => {
        const {state} = this.props;
        state.data.GROUP_ID = value;
    };

    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;
        let value = state.data[id];
        if (id === "START_TIME" || id === "END_TIME") {
            if (value && value.length === 2) {
                options.initialValue = [moment(value[0]), moment(value[1])];
            } else {
                options.initialValue = [];
            }
        } else {
            options.initialValue = value;
        }
        return form.getFieldDecorator(id, options);
    };

    render() {
        // const {onAddClick, onSearchClick} = this.props;
        const {state} = this.props;
        return (
            <Layout>
                <div className={style.row}>

                    <FormItem
                        style={{width: 300}}
                        label="运维组"
                    >
                        {this.getFieldDecorator("GROUP_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                onSelect={this.onGroupSelect}
                                url="/systemmanager/operation/group/op-group"
                                parse={{CODE: "ID", VALUE: "NAME"}}
                                width="100%"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        style={{width: 400}}
                        label="任务开始时间"
                    >
                        {this.getFieldDecorator("START_TIME")(
                            <DatePicker.RangePicker
                                format="YYYY-MM-DD"
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
                    <FormItem
                        style={{width: 80}}
                    >
                        <Button
                            type="primary"
                            icon="search"
                            onClick={this.onAddClick}
                        >制定计划</Button>
                    </FormItem>
                </div>
                <div className={style.row}>
                    <FormItem
                        style={{width: 300}}
                        label="站点"
                    >
                        {this.getFieldDecorator("SITE_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                url="/systemmanager/ent/setting/site/group-site-list"
                                parse={{CODE: "ID", VALUE: "NAME"}}
                                params={{GROUP_ID: state.data.GROUP_ID}}
                                width="100%"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        style={{width: 400}}
                        label="任务截止时间"
                    >
                        {this.getFieldDecorator("END_TIME")(
                            <DatePicker.RangePicker
                                format="YYYY-MM-DD"
                            />
                        )}
                    </FormItem>
                </div>
            </Layout>
        );
    }
}
