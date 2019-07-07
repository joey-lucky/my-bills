import * as React from "react";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";
import * as PropTypes from "prop-types";

export default class Bottom extends React.Component {
    static propTypes = {
        onSaveClick: PropTypes.func.isRequired,
        onChangeToTransferBillClick: PropTypes.func.isRequired,
        onDeleteClick: PropTypes.func.isRequired,
        isTransferBill: PropTypes.bool,
    };

    render(){
        return (
            <Flex
                style={styles.container}
                align={"center"}
                justify={"around"}
            >
                <Flex
                    style={styles.save}
                    align={"center"}
                    justify={"center"}
                    onClick={this.props.onSaveClick}
                >
                    保存
                </Flex>
                <Flex
                    style={styles.delete}
                    align={"center"}
                    justify={"center"}
                    onClick={this.props.onDeleteClick}
                >
                    删除
                </Flex>
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "1.75rem"
    },
    save: {
        height: "1.17rem",
        width: "7rem",
        backgroundColor:"#FF9C00",
        color:"white",
        fontSize:fontSizes.appBar,
        borderRadius:"0.05rem",
        border:"none"
    },
    delete:{
        height: "1.17rem",
        width: "2.65rem",
        backgroundColor:"#FDEFEF",
        color:"#D03435",
        fontSize:fontSizes.appBar,
        borderRadius:"0.05rem",
        border:"none"
    }

};