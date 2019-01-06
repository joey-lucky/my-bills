import React from "react";
import {Col, Row} from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import * as style from "./MonthTable.css";

export default class MonthTable extends React.Component {
    static propTypes = {
        renderDay: PropTypes.any,
        onDayClick: PropTypes.any,
        year: PropTypes.any,
        month: PropTypes.any
    };

    _weekInfos = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    /**
     * 获取对应年和月的，所有日期，用于绘制界面
     */
    getWeeksOfMonth = (year, month) => {

        /**
         * 获取当前日期
         */
        let today = moment();

        /**
         * 构造日期对象
         */
        let day = moment(year + "-" + month + "-1");

        /**
         * 获取在日期矩阵里，当前月份第一天的索引位置
         */
        let indexOfDayStart = day.day();

        /**
         * 获取在日期矩阵中，当前月份最后一天的索引位置
         */
        let indexOfDayEnd = day.endOf("month").date() - 1 + indexOfDayStart;

        let weeks = [];

        /**
         * 构造一个7*5（横*竖）的矩阵
         * 把当前月份的日期按照规则摆放在其中
         */
        for (let i = 0; i < 5; i++) {

            let days = [];

            for (let j = 0; j < 7; j++) {
                let index = (i * 7) + j;
                let isToday = false;

                /**
                 * 计算当前格子所在日期，可能是代表有意义的日期，也可能没意义
                 */
                let dayOfMonth = index >= indexOfDayStart && index <= indexOfDayEnd ? (index - indexOfDayStart) + 1 : "";

                /**
                 * 判断是否是当前日期，在界面上可以突出显示
                 */
                if (dayOfMonth === today.date() && month === (today.month() + 1)) {
                    isToday = true;
                }

                days.push({
                    index: index,
                    isToday: isToday,
                    date: dayOfMonth,
                    month: month,
                    year: year
                });
            }
            weeks.push(days);
        }


        return weeks;
    };

    renderDay(day) {
        let {renderDay} = this.props;

        if (renderDay) {
            return renderDay(day);
        }
    }

    onDayClick(day) {
        let {onDayClick} = this.props;

        if (onDayClick) {
            onDayClick(day);
        }
    }

    render() {
        let {renderDay, year, month} = this.props;

        if (!renderDay) {
            renderDay = this.renderDay;
        }

        let weeks = this.getWeeksOfMonth(year, month);

        /**
         * 标题部分内容
         */
        let titles = [];

        for (let i = 0; i < 7; i++) {
            titles.push(
                <Col className={style.title} span={3} key={i}>{this._weekInfos[i]}</Col>
            );
        }

        return (
            <div className={style.month}>
                <Row key={8}>{titles}</Row>
                {
                    weeks.map((days, index) => <Row className={style.week} type="flex" justify="start" key={index}>
                        {
                            days.map((day, index) =>
                                <Col
                                    className={style.day + " " + (day.isToday ? style.today : "")}
                                    span={3} key={index}
                                >
                                    {day.date}
                                    <div
                                        className={style.data}
                                        role="button"
                                        onClick={() => this.onDayClick(day)}
                                    >
                                        {this.renderDay(day)}
                                    </div>
                                </Col>
                            )
                        }
                    </Row>)
                }
            </div>
        );
    }
}
