import * as React from "react";
import {Flex} from "antd-mobile";
import {Divider} from "@components/Divider";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import fontSizes from "@res/fontSizes";
import BlankFlex from "@components/BlankFlex";
import Text from "@components/Text";


export default class RemarkInput extends React.Component {


    render() {
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <Flex
                    style={styles.contentContainer}
                    direction={"row"}
                >
                    <FontIcon
                        style={{color: "#8880EF", fontSize: fontSizes.appBar}}
                        unicode={icons.xe321}
                    />
                    <BlankFlex blankLevel={1} blankDirection={"row"}/>
                    <Text type={"text"} text={"备注"}/>
                </Flex>

                <Divider direction={"row"}/>
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "1.6rem",
    },
    contentContainer: {
        width: "100%",
        height: 0,
        flex: 1,
    }
};