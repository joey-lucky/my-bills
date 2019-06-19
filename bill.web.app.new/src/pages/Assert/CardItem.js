import * as React from "react";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import {fontSizes} from "@global";
import Text from "@components/Text";
import colors from "@res/colors";
import BlankFlex from "@components/BlankFlex";


export default class CardItem extends React.Component {
    render() {
        return (
            <Flex
                style={styles.container}
                direction={"row"}
                align={"center"}
                justify={"start"}
            >
                <FontIcon
                    style={{color: "#59C297", fontSize: fontSizes.appBar}}
                    unicode={icons.xe401}/>

                <BlankFlex
                    blankLevel={2}
                    blankDirection={"row"}
                    style={styles.cardName}
                    justify={"start"}
                >
                    <Text type={"title"} text={"现金"}/>
                </BlankFlex>
                <BlankFlex blankDirection={"row"} blankLevel={1}>
                    <Text type={"title"} text={"7765"}/>
                </BlankFlex>
                <BlankFlex blankLevel={2} blankDirection={"row"}>
                    <FontIcon
                        style={{color: colors.text, fontSize: fontSizes.title}}
                        unicode={icons.right}/>
                </BlankFlex>
            </Flex>
        );
    }
}


const styles = {
    container: {
        width: "100%",
        height: "1.95rem",
    },
    cardName: {
        width: 0,
        flex: 1
    }
};