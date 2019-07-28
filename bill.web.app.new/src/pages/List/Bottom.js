import * as React from "react";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";
import * as PropTypes from "prop-types";
import {billListApi} from "../../services/api";
import RemoteDataPicker from "@components/RemoteDataPicker";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import createForm from "rc-form/es/createForm";

@createForm({
    onValuesChange:(props,changeValues,allValues)=>{
        props.onChange(allValues);
    }
})
export default class Bottom extends React.Component {
    static propTypes = {
        onChange:PropTypes.func
    };

    render(){
        return (
            <Flex
                style={styles.container}
                direction={"row"}
                align={"center"}
            >
                <Flex
                    style={{height:"100%",width:"120px"}}
                    direction={"row"}
                    justify={"center"}
                    align={"center"}
                >
                    <RemoteDataPicker
                        {...this.props.form.getFieldProps("userId")}
                        defaultValue={""}
                        extra={[{id:"",name:"全部"}]}
                        cols={1}
                        url={billListApi.getUserListUrl}
                    />
                    <FontIcon
                        unicode={icons.xe502}
                    />
                </Flex>
            </Flex>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "1.45rem",
        borderTop:"1px solid #F5F5F5",
        fontSize:"0.4rem"
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