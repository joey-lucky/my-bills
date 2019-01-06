import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import moment from "moment";
import MonthTable from "./MonthTable";
import TaskCalendarFilter from "./TaskCalendarFilter";
import TaskListDialog from "./TaskListDialog";
import {Ajax} from "@utils/ajax";

class AppState {
    @observable taskCountData = {};
    taskListDialogState = TaskListDialog.newState();
    taskCalendarFilter = TaskCalendarFilter.newState();

    /**
     * 获取详细任务列表，为任务列表对话框提供数据
     */
    getTaskListData(day) {

        let filterData = this.taskCalendarFilter.data;
        let {year, month, date} = day;

        let queryObj = {
            "JOB_ID": filterData.JOB_ID,
            "CONTRACT_ID": filterData.CONTRACT_ID,
            "GROUP_ID": filterData.GROUP_ID,
            "SITE_ID": filterData.SITE_ID,
            "START_TIME>=": year + "-" + month + "-" + date + " 00:00:00",
            "START_TIME<=": year + "-" + month + "-" + date + " 23:59:59"
        };

        let me = this;

        Ajax.apiPost("/op/taskmanager/optask/list-model", queryObj).then((data) => {
            me.taskListDialogState.data = data.data;
        });
    }

    /**
     * 获取任务统计信息
     */
    getTaskCountData(values) {
        let queryObj = {
            "JOB_ID": values.JOB_ID,
            "CONTRACT_ID": values.CONTRACT_ID,
            "GROUP_ID": values.GROUP_ID,
            "SITE_ID": values.SITE_ID,
            "START_TIME": values.START_DATE,
            "END_TIME": values.END_DATE
        };

        let me = this;

        Ajax.apiPost("/op/taskmanager/optask/get-task-calendar", queryObj).then((data) => {

            let taskData = {};

            for (let i = 0; i < data.data.length; i++) {
                let task = data.data[i];
                let startDate = moment(task.TASK_DATE);
                let day = startDate.date();

                if (!taskData[day]) {
                    taskData[day] = [];
                }

                taskData[day].push(task);

            }
            me.taskCountData = taskData;
        });
    }

}

@observer
export default class TaskCalendar extends React.Component {
    _appState = new AppState();

    constructor(props) {
        super(props);
        let month = (moment().month()) + 1;
        this.state = {
            year: "2018",
            month: month,
            data: {}
        };
        this._appState.getTaskCountData({
            START_DATE: "2018-" + month + "-01 00:00:00",
            END_DATE: "2018-" + (month + 1) + "-01 00:00:00"
        });
    }

    /**
     * 渲染单个日期格
     */
    renderDay = (day, data) => {
        const {date} = day;
        let tasks = toJS(data[date]);
        let desc;

        if (!date) {
            return "";
        }

        if (!tasks) {
            return <span>无任务</span>;
        }

        if (tasks.length >= 2) {
            let length = toJS(data[date]).length;
            tasks = tasks.slice(0, 1);
            desc = <div>等{length}个站点</div>;
        }

        return (<div>{
            tasks.map((item, index) => <div key={item.NAME}>{item.NAME + "(" + item.TASK_COUNT + ")"}</div>)
        }{
            desc
        }</div>);
    };

    onSearch(values) {
        this.setState({
            year: values.YEAR,
            month: values.MONTH
        });
        this._appState.getTaskCountData(values);
    }

    /**
     * 日期点击事件
     */
    onDayClick(day) {
        this._appState.getTaskListData(day);
        this._appState.taskListDialogState.show();
    }

    render() {
        const {year, month} = this.state;
        const {taskCountData, taskListDialogState, taskCalendarFilter} = this._appState;

        return (
            <div>
                <TaskListDialog
                    state={taskListDialogState}
                />
                <TaskCalendarFilter
                    state={taskCalendarFilter}
                    onSearchClick={values => this.onSearch(values)}
                />
                <MonthTable
                    onDayClick={day => this.onDayClick(day)}
                    year={year}
                    month={month}
                    renderDay={day => this.renderDay(day, taskCountData)}
                />
            </div>
        );
    }
}
