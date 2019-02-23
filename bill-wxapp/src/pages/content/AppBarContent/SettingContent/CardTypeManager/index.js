import * as React from "react";
import CardTypeList from "./CardTypeList";
import CardTypeAdd from "./CardTypeAdd";
import {observable} from "mobx";


export default class CardTypeManager extends React.Component {
    @observable editState = {
        visible:false,
        id:""
    };

    render() {
        return (
            <React.Fragment>
                <CardTypeList/>
                <CardTypeAdd state={this.editState}/>
            </React.Fragment>
        );
    }
}