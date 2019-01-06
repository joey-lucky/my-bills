import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {Button, Form, Layout, Select} from "antd";
import moment from "moment";
import * as style from "./TaskCalendarFilter.css";
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
        YEAR: "2018",
        MONTH: "",
        GROUP_ID: "",
        SITE_ID: ""
    };

    constructor() {
        this.data.MONTH = (moment().month()) + 1;
    }
}

@Form.create()
@observer
export default class TaskCalendarFilter extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        form: PropTypes.any,
        onSearchClick: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    years = ["2018"];

    months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    onGroupSelect = (value) => {
        const {state} = this.props;
        state.data.GROUP_ID = value;
    };

    onContractSelect = (value) => {
        const {state, form} = this.props;
        state.data.CONTRACT_ID = value;
        form.setFieldsValue({SITE_ID: ""});
    };


    getFieldDecorator = (id, options = {}) => {
        const {form, state} = this.props;
        let value = state.data[id];
        options.initialValue = value;
        return form.getFieldDecorator(id, options);
    };

    getFieldsValues = () => {
        const {form} = this.props;
        let values = form.getFieldsValue();
        let start = moment(values.YEAR + "-" + values.MONTH + "-01");
        let startDate = start.format("YYYY-MM-DD");
        let endDate = start.add(1, "month").format("YYYY-MM-DD");
        values.START_DATE = startDate + " 00:00:00";
        values.END_DATE = endDate + " 00:00:00";
        return values;
    };

    onSearchClick = () => {
        const {onSearchClick, state} = this.props;
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
                        label="运维合同"
                    >
                        {this.getFieldDecorator("CONTRACT_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                onSelect={this.onContractSelect}
                                url="/systemmanager/operation/contract/list-model"
                                parse={{CODE: "ID", VALUE: "NAME"}}
                                width="100%"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        style={{width: 300}}
                        label="运维组"
                    >
                        {this.getFieldDecorator("GROUP_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                onSelect={this.onGroupSelect}
                                url="/systemmanager/operation/group/list"
                                parse={{CODE: "ID", VALUE: "NAME"}}
                                width="100%"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        style={{width: 300}}
                        label="站点"
                    >
                        {this.getFieldDecorator("SITE_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                url="/systemmanager/ent/setting/site/list"
                                parse={{CODE: "ID", VALUE: "NAME"}}
                                params={{GROUP_ID: state.data.GROUP_ID, CONTRACT_ID: state.data.CONTRACT_ID}}
                                width="100%"
                            />
                        )}
                    </FormItem>
                </div>
                <div className={style.row}>
                    <FormItem
                        style={{width: 300}}
                        label="运维任务"
                    >
                        {this.getFieldDecorator("JOB_ID")(
                            <TableSelect
                                emptyLabel="全部"
                                url="/systemmanager/operation/opjob/list-model"
                                parse={{CODE: "ID", VALUE: "JOB_TYPE_DESC"}}
                                params={{CONTRACT_ID: state.data.CONTRACT_ID}}
                                width="100%"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        style={{width: 300}}
                        label="时间"
                    >
                        {this.getFieldDecorator("YEAR")(
                            <Select style={{width: 100}}>
                                {
                                    this.years.map((item, index) =>
                                        <Select.Option key={item} value={item}>{item}</Select.Option>
                                    )
                                }
                            </Select>
                        )}
                        {this.getFieldDecorator("MONTH")(
                            <Select style={{width: 100}}>
                                {
                                    this.months.map((item, index) =>
                                        <Select.Option key={item} value={item}>{item}</Select.Option>
                                    )
                                }
                            </Select>
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
            </Layout>
        );
    }
}
