import * as React from "react";
import {Flex} from "antd-mobile";
import colors from "@res/colors";
import * as PropTypes from "prop-types";
import moment from "moment";

export default class DayItem extends React.Component {
    static propTypes = {
        date: PropTypes.objectOf(Date).isRequired,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let dateMoment = moment(nextProps.date);
        dateMoment.locale('zh-cn');
        return {
            day: dateMoment.format("DD日"),
            yearMonthWeek: dateMoment.format("YYYY.MM   ddd"),
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            day: "",
            yearMonthWeek: "",
        };
    }

    render() {
        let {day, yearMonthWeek} = this.state;
        return (
            <Flex
                style={styles.container}
                direction={"row"}
                align={"center"}
                justify={"start"}
                onClick={this.onClick}
            >
                <Flex
                    direction={"row"}
                    align={"baseline"}
                >
                    <span style={styles.title}>{day}</span>
                    <span style={styles.tooltip}>{yearMonthWeek}</span>
                </Flex>
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "1.38rem",
        paddingLeft: "0.54rem"
    },
    title: {
        fontSize: "0.54rem",
        color: colors.title,
        fontWeight: 600,
        marginRight: "0.2rem"
    },
    tooltip: {
        fontSize: "0.25rem",
        color: colors.tooltip
    },
};