import * as React from "react";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";
import * as PropTypes from "prop-types";


export default class Bottom extends React.Component {
    static propTypes = {
        onSaveClick: PropTypes.func.isRequired,
        onSaveTemplateClick: PropTypes.func.isRequired,
        onSaveAgainClick: PropTypes.func.isRequired,
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
                    style={styles.other}
                    align={"center"}
                    justify={"center"}
                    onClick={this.props.onSaveTemplateClick}
                >
                    存为模板
                </Flex>
                <Flex
                    style={styles.other}
                    align={"center"}
                    justify={"center"}
                    onClick={this.props.onSaveAgainClick}
                >
                    再记一笔
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
        width: "4.35rem",
        backgroundColor:"#FF9C00",
        color:"white",
        fontSize:fontSizes.appBar,
        borderRadius:"0.05rem",
        border:"none"
    },

    other:{
        height: "1.17rem",
        width: "2.65rem",
        backgroundColor:"#F1F1F1",
        color:colors.text,
        fontSize:fontSizes.appBar,
        borderRadius:"0.05rem",
        border:"none"
    }

};