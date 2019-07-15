import * as React from "react";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import colors from "@res/colors";
import * as PropTypes from "prop-types";
import moment from "moment";

export default class BillItem extends React.Component {
    static propTypes = {
        data:PropTypes.shape({
            money: PropTypes.number.isRequired,
            billDesc: PropTypes.string.isRequired,
            dateTime: PropTypes.string.isRequired,
            billTypeTypeName: PropTypes.string.isRequired,
        }),
        showDivider: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let {dateTime, money = 0} = nextProps.data;
        let dateMoment = moment(dateTime);
        return {
            time: dateMoment.format("HH:mm"),
            money: money.toFixed(2),
        };
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            time: "",
            money: "",
        };
    }

    render() {
        let {time,money} = this.state;
        let {showDivider,data} = this.props;
        let {billDesc, billTypeTypeName} = data;
        return (
            <Flex
                style={styles.container}
                direction={"column"}
                onClick={(event) => {
                    event.stopPropagation();
                    this.props.onClick && this.props.onClick()
                }}
            >
                <Flex
                    style={styles.content}
                    direction={"row"}
                    align={"center"}
                    justify={"start"}
                >

                    <FontIcon
                        style={styles.icon}
                        unicode={icons.xe301}
                    />

                    <Flex
                        style={styles.dateContainer}
                        direction={"column"}
                        align={"start"}
                    >
                        <div style={commonStyles.title}>{billDesc}</div>
                        <div style={styles.time}>{time}</div>
                    </Flex>

                    <div
                        style={{...styles.money, color: colors.getMoneyColor(billTypeTypeName)}}
                    >
                        {money}
                    </div>
                </Flex>
                {
                    showDivider&& <div style={styles.divider}/>
                }

            </Flex>
        );
    }
}
const commonStyles = {
    title: {
        fontSize: "0.44rem",
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
        height: "1.75rem",
        paddingLeft: "0.54rem"
    },
    divider: {
        width: "100%",
        height: "1px",
        color:colors.divider
    },
    content: {
        width: "100%",
        height: "100%",
    },
    icon: {
        width: "1.18rem",
        fontSize: "0.72rem",
        textAlign: "start",
        paddingLeft:"0.1rem",
        color:colors.income
    },
    time:{
        ...commonStyles.tooltip,
        marginTop: "0.1rem"
    },
    dateContainer: {
        width: "0rem",
        flex:1,
    },
    money:{
        ...commonStyles.title,
        paddingRight: "0.54rem",
    }
};