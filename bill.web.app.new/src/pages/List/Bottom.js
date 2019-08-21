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

const billTypeTypeData = [
    {id:"",name:"全部"},
    {id:"-1",name:"支出"},
    {id:"1",name:"收入"},
    {id:"0",name:"转账"},
];
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
                    style={{height:"100%"}}
                    direction={"row"}
                    justify={"center"}
                    align={"center"}
                >
                    <RemoteDataPicker
                        {...this.props.form.getFieldProps("userId",{initialValue:""})}
                        style={{width:"2.2rem",height:"100%"}}
                        defaultValue={""}
                        extra={[{id:"",name:"全部"}]}
                        cols={1}
                        url={billListApi.getUserListUrl}
                        justify={"center"}
                        align={"center"}
                    />
                    <RemoteDataPicker
                        {...this.props.form.getFieldProps("billTypeType",{initialValue:""})}
                        style={{width:"2.2rem",height:"100%",marginLeft:"0.12rem"}}
                        extra={billTypeTypeData}
                        cols={1}
                        justify={"center"}
                        align={"center"}
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