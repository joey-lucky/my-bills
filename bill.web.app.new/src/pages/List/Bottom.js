import * as React from "react";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";
import * as PropTypes from "prop-types";
import {baseBillEditApi} from "../../services/api";
import TablePicker from "@components/TablePicker";
import PickerItem from "@components/BaseBillEdit/PickerItem";


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
                direction={"row"}
                align={"center"}
                justify={"around"}
            >
                <TablePicker
                    cols={2}
                    parse={{id: "userName", name: "userName", children: {id: "id", name: "name"}}}
                    url={baseBillEditApi.getCardListUrl}
                />
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "1.45rem"
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