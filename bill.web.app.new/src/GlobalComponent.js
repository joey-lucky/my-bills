import React from "react";
import {waitDialogStore} from "./stores";
import {ActivityIndicator} from "antd-mobile";
import {observer} from "mobx-react";

@observer
export default class GlobalComponent extends React.Component{
    render(){
        return(
            <React.Fragment>
                <ActivityIndicator
                    animating={waitDialogStore.visible}
                    text={waitDialogStore.text}
                    toast={true}
                    size={"large"}
                />
            </React.Fragment>
        );
    }
}