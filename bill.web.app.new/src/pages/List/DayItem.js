import * as React from "react";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import colors from "@res/colors";
import * as PropTypes from "prop-types";
import moment from "moment";

export default class DayItem extends React.Component {
    static propTypes = {
        data:PropTypes.shape({
            money: PropTypes.number.isRequired,
            billDesc: PropTypes.string.isRequired,
            dateTime: PropTypes.string.isRequired,
            cardName: PropTypes.string.isRequired,
            cardUserName: PropTypes.string.isRequired,
            billTypeName: PropTypes.string.isRequired,
            billTypeTypeName: PropTypes.string.isRequired,
        }),
        showDate: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let {dateTime, money = 0} = nextProps.data;
        let dateMoment = moment(dateTime);
        dateMoment.locale('zh-cn');
        return {
            day: dateMoment.format("DD"),
            week: dateMoment.format("ddd"),
            time: dateMoment.format("HH:mm"),
            money: money.toFixed(2),
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            day: "",
            week: "",
            time: "",
            money: "",
        };
    }

    onClick = (event) => {
        event.stopPropagation();
        let expand = !this.state.expand;
        this.setState({expand});
        this.props.onExpandChange && this.props.onExpandChange(expand);
    };

    render() {
        let {day, week, time, money} = this.state;
        let {showDate,data} =  this.props;
        let {billDesc, cardName, billTypeName,cardUserName, billTypeTypeName} = data;
        return (
            <Flex
                style={styles.container}
                onClick={(event) => {
                    this.props.onClick && this.props.onClick()
                }}
            >
                <Flex
                    style={styles.container1}
                    direction={"row"}
                    align={"center"}
                    justify={"start"}
                >
                    <Flex
                        style={styles.dateContainer}
                        direction={"column"}
                        align={"start"}
                    >
                        {
                            showDate &&
                            <div style={commonStyles.title}>{day}</div>
                        }
                        {
                            showDate &&
                            <div style={styles.week}>{week}</div>
                        }
                    </Flex>
                    <FontIcon
                        style={styles.icon}
                        unicode={icons.xe301}
                    />

                    <Flex
                        style={styles.billDescContainer}
                        direction={"column"}
                        align={"start"}
                    >
                        <div style={commonStyles.title}>{billDesc}</div>
                        <Flex
                            direction={"row"}
                            style={commonStyles.tooltip}
                        >
                            <div>{time}</div>
                            <div style={styles.division}>·</div>
                            <div>{cardUserName+"  ·  "+cardName}</div>
                        </Flex>
                    </Flex>
                    <div
                        style={{...styles.money, color: colors.getMoneyColor(billTypeTypeName)}}
                    >
                        {money}
                    </div>
                </Flex>
            </Flex>
        );
    }
}
const commonStyles = {
    title: {
        fontSize: "0.41rem",
        color: colors.title
    },
    tooltip: {
        fontSize: "0.27rem",
        color: colors.tooltip
    },
};

const styles = {
    container: {
        width: "100%",
        height: "1.67rem",
        paddingLeft: "0.54rem"
    },
    container1: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.dividerLight
    },
    dateContainer: {
        paddingLeft: "0.2rem",
        width: "1rem"
    },
    week: {
        marginTop: "0.1rem",
        ...commonStyles.tooltip
    },
    icon: {
        width: "1.4rem",
        color: colors.income,
        fontSize: "0.72rem",
        textAlign: "center"
    },
    billDescContainer: {
        width: 0,
        flex: 1,
    },
    division: {
        padding: "0 0.1rem"
    },
    money:{
        ...commonStyles.title,
        paddingRight: "0.54rem",
    }
};