import * as React from "react";
import BillList from "./BillList";
import BillAdd from "./BillAdd";
import {observable} from "mobx";
import {observer} from "mobx-react";

@observer
export default class BillManager extends React.Component {
    @observable editState = {
        visible: false,
        id: undefined
    };

    onAddClick = () => {
        this.editState = {
            visible: true,
            id: undefined
        }
    };

    onItemClick = (id) => {
        this.editState = {
            visible: true,
            id: id
        }
    };

    onAddBackClick = () => {
        this.editState = {
            visible: false,
            id: undefined
        }
    };

    onAddSuccess = () => {
        this.editState = {
            visible: false,
            id: undefined
        }
    };

    render() {
        return (
            <React.Fragment>
                {
                    this.editState.visible?
                        <BillAdd id={this.editState.id}
                                 onBackClick={this.onAddBackClick}
                                 onAddSuccess={this.onAddSuccess}
                        />:
                        <BillList onAddClick={this.onAddClick}
                                  onItemClick={this.onItemClick}
                        />
                }
            </React.Fragment>
        );
    }
}