import * as React from "react";
import CardList from "./CardList";
import CardAdd from "./CardAdd";
import {observable} from "mobx";


export default class CardManager extends React.Component {
    @observable editState = {
        visible:false,
        id:""
    };

    render() {
        return (
            <React.Fragment>
                <CardList/>
                <CardAdd state={this.editState}/>
            </React.Fragment>
        );
    }
}