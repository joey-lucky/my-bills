import * as React from "react";
import {Flex} from "antd-mobile";
import CardItem from "@pages/Assert/CardItem";
import Text from "@components/Text";
import {Divider} from "@components/Divider";


export default class CardTypeItem extends React.Component{
    render(){
        return(
            <Flex
                style={styles.container}
                justify={"start"}
                direction={"column"}
                align={"start"}
            >
                <Text
                    style={{padding:"0.56rem 0"}}
                    text={"现金账户  资产 7774"}
                    type={"text"}
                />
                <CardItem/>
                <CardItem/>
                <CardItem/>
            </Flex>
        );
    }
}

const styles = {
    container:{
        width:"100%",
        padding:"0 0.56rem"
    }
};