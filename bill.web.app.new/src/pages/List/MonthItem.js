import * as React from "react";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import colors from "@res/colors";
import fontSizes from "@res/fontSizes";
import * as PropTypes from "prop-types";
import moment from "moment";

export default class MonthItem extends React.Component {
    static propTypes = {
        date: PropTypes.objectOf(Date).isRequired,
        income: PropTypes.number.isRequired,
        outgoing: PropTypes.number.isRequired,
        defaultExpand: PropTypes.bool.isRequired,
        onExpandChange: PropTypes.func.isRequired,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let {date, income, outgoing} = nextProps;
        let dateMoment = moment(date);
        return {
            month: dateMoment.format("M月"),
            year: dateMoment.format("YYYY年"),
            money: (income - outgoing).toFixed(2)
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            month: "",
            year: "",
            money: "",
            expand: this.props.defaultExpand || false
        };
    }

    onClick = (event) => {
        event.stopPropagation();
        let expand = !this.state.expand;
        this.setState({expand});
        this.props.onExpandChange && this.props.onExpandChange(expand);
    };

    render() {
        let {money, month, year, expand} = this.state;
        return (
            <Flex
                style={styles.container}
                direction={"row"}
                align={"center"}
                justify={"start"}
                onClick={this.onClick}

            >
                <Flex
                    style={styles.dateContainer}
                    direction={"column"}
                    align={"start"}
                >
                    <div style={commonStyles.title}>{month}</div>
                    <div style={styles.year}>{year}</div>
                </Flex>
                <Flex
                    style={styles.moneyContainer}
                    direction={"column"}
                    align={"start"}
                >
                    <Flex
                        direction={"row"}
                        align={"baseline"}
                    >
                        <div style={commonStyles.title}>{money}</div>
                        <div style={styles.money}>结余</div>
                    </Flex>
                    <Flex
                        direction={"row"}
                        style={commonStyles.tooltip}
                    >
                        <div style={styles.income}>收入</div>
                        <div>{this.props.income}</div>
                        <div style={styles.division}>|</div>
                        <div style={styles.outgoing}>支出</div>
                        <div>{this.props.outgoing}</div>
                    </Flex>
                </Flex>
                <FontIcon
                    style={styles.icon}
                    unicode={expand ? icons.up : icons.down}
                />
            </Flex>
        );
    }
}
const commonStyles = {
    title: {
        fontSize: "0.54rem",
        color: colors.title
    },
    tooltip: {
        fontSize: "0.3rem",
        color: colors.tooltip
    },
};

const styles = {
    container: {
        width: "100%",
        height: "2.53rem",
        paddingLeft: "0.54rem"
    },
    dateContainer: {
        width: "2.4rem"
    },
    year: {
        marginTop: "0.1rem",
        ...commonStyles.tooltip
    },
    billDescContainer: {
        width: 0,
        flex: 1,
    },
    money: {
        paddingLeft: "0.1rem",
        ...commonStyles.tooltip
    },
    moneyContainer:{
      width:0,
      flex:1,
    },
    income: {
        color: colors.income,
        paddingRight: "0.1rem"
    },
    outgoing: {
        color: colors.outgoing,
        paddingRight: "0.1rem"
    },
    division: {
        padding: "0 0.2rem"
    },
    icon: {
        width: "1.5rem",
        color: "#BFBFBF",
        fontSize: fontSizes.text,
        textAlign: "center"
    },
};