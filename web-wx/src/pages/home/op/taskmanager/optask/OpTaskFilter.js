import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import moment from "moment";
import {Button, DatePicker, Form, Layout, Radio} from "antd";
import * as style from "./OpTaskList.css";
import TableSelect from "@components/TableSelect"

const RadioGroup = Radio.Group;
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
        START_TIME: [],
        GROUP_ID: "",
        SITE_ID: "",
        TASK_STATUS: ""
    };
}

@Form.create()
@observer
export default class OpTaskFilter extends React.Component {
    static propTypes = {
        onAddClick: PropTypes.any,
        onSearchClick: PropTypes.any,
        state: PropTypes.any,
        form: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

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
        if (id === "START_TIME") {
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

    getFieldsValues = () => {
        const {form} = this.props;
        let values = form.getFieldsValue();
        // 对时间格式进行转换
        let dateTime = values.START_TIME;
        if (dateTime && dateTime.length === 2) {
            return {
                ...values,
                START_TIME: [dateTime[0].format("YYYY-MM-DD") + " 00:00:00", dateTime[1].format("YYYY-MM-DD") + " 23:59:59"]
            };
        } else {
            return {
                ...values,
                START_TIME: []
            };
        }
    };

    onSearchClick = () => {
        const {state, onSearchClick} = this.props;
        let values = this.getFieldsValues();
        state.data = values;
        onSearchClick && onSearchClick(values);
    };

    render() {
        const {state} = this.props;
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
                        style={{width: 400}}
                        label="任务状态"
                    >
                        {this.getFieldDecorator("TASK_STATUS")(
                            <RadioGroup
                                style={{display: "flex", alignItems: "center"}}
                                name="radiogroup"
                            >
                                <Radio value={""}>全部</Radio>
                                <Radio value={"1"}>已完成</Radio>
                                <Radio value={"0"}>未完成</Radio>
                            </RadioGroup>
                        )}
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
                        style={{width: 300}}
                        label="任务类型"
                    >
                        {this.getFieldDecorator("JOB_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                url="/op/taskmanager/optask/job-list"
                                parse={{CODE: "ID", VALUE: "NAME"}}
                                width="100%"
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
                        >派发任务</Button>
                    </FormItem>
                </div>
            </Layout>
        );
    }
}
