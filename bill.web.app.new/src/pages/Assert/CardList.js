import * as React from "react";
import {Flex} from "antd-mobile";
import Card from "./Card";
import Text from "@components/Text";
import {Divider} from "@components/Divider";
import * as PropTypes from "prop-types";


export default class CardList extends React.Component {
    static propTypes = {
        cardData: PropTypes.arrayOf({
            name: PropTypes.string.isRequired,
            balance: PropTypes.number.isRequired,
        }),
        cardTypeName: PropTypes.string.isRequired,
        totalBalance: PropTypes.number.isRequired,
        onItemCLick: PropTypes.func,
    };


    render() {
        let {cardTypeName, totalBalance = 0, cardData = [], onItemCLick} = this.props;
        let title = `${cardTypeName} ${totalBalance > 0 ? "资产" : "负债"} ${Math.abs(totalBalance)}`;
        return (
            <Flex
                style={styles.container}
                justify={"start"}
                direction={"column"}
                align={"start"}
            >
                <Text
                    style={styles.text}
                    text={title}
                    type={"text"}
                    color={"#AAAAAA"}
                />
                {
                    cardData.map((item, index) =>
                        <React.Fragment key={cardTypeName + item.name}>
                            <Card
                                balance={item.balance}
                                name={item.name}
                                onClick={() => {
                                    onItemCLick(item, index, cardData);
                                }}
                            />
                            {
                                index !== cardData.length - 1 &&
                                <Divider
                                    style={styles.divider}
                                    direction={"row"}
                                    size={"1px"}
                                />
                            }
                        </React.Fragment>
                    )

                }
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
    },
    text: {
        paddingTop: "0.54rem",
        paddingBottom: "0.28rem",
        paddingLeft: "0.54rem",
    },
    divider: {
        marginLeft: "0.54rem"
    }
};