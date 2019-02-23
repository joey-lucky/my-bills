import * as React from "react";
import BillTypeList from "./BillTypeList";
import BillTypeAdd from "./BillTypeAdd";
import {observable} from "mobx";


export default class BillTypeManager extends React.Component {
    @observable editState = {
        visible:false,
        id:""
    };

    render() {
        return (
            <React.Fragment>
                <BillTypeList/>
                <BillTypeAdd state={this.editState}/>
            </React.Fragment>
        );
    }
}