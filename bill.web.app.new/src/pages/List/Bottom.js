import * as React from "react";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";
import * as PropTypes from "prop-types";
import createForm from "rc-form/es/createForm";
import {RemotePicker} from "@components/remote";
import {dictDataAPI, userAPI} from "@services/index";

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
                    <RemotePicker
                        {...this.props.form.getFieldProps("userId",{initialValue:""})}
                        style={{width:"2.5rem",height:"100%"}}
                        extra={[{id:"",name:"全部"}]}
                        loadData={userAPI.index}
                        justify={"center"}
                        align={"center"}
                    />
                    <RemotePicker
                        {...this.props.form.getFieldProps("billTypeType",{initialValue:""})}
                        style={{width:"2.5rem",height:"100%"}}
                        loadData={dictDataAPI.index}
                        params={{typeCode:"bill_type"}}
                        extra={[{id:"",name:"全部"}]}
                        parse={{id:"code",name:"value"}}
                        justify={"center"}
                        align={"center"}
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