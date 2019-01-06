import React from "react";
import {withRouter} from "react-router-dom";
import {observable} from "mobx";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import DictDataList from "./DictDataList";

class DictDataManagerState {
    @observable visible = "none";

    constructor() {
        this.dictDataListState = DictDataList.newState();
    }

    show(dictTypeCode) {
        this.visible = "block";
        this.dictDataListState.getList(dictTypeCode);
    }

    hide() {
        this.visible = "none";
    }
}

@withRouter
@observer
export default class DictDataManager extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new DictDataManagerState();
    }

    render() {
        return (
            <div style={{display: this.props.state.visible}}>
                <DictDataList
                    state={this.props.state.dictDataListState} onEditClick={data => this.onEditClick(data)}
                    onAddChildClick={data => this.onAddChildClick(data)}
                />
            </div>
        );
    }
}
