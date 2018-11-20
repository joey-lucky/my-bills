import React from "react";
import {Button} from "antd";
import FunctionAdd from "./FunctionAdd";
import FunctionList from "./FunctionList";

export default class FunctionManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            functionAddState: FunctionAdd.newState(),
            functionListState: FunctionList.newState()
        };
        this.state.functionListState.getList();
    }

    /**
     * 新增点击事件
     */
    onAddClick() {
        var data = {};
        this.state.functionAddState.data = data;
        this.state.functionAddState.show();
    }

    /**
     * 新增完成事件，刷新列表
     */
    onAdded() {
        this.state.functionListState.getList();
    }


    render() {
        return (
            <div>
                <Button onClick={() => this.onAddClick()}>新增</Button>
                <FunctionAdd state={this.state.functionAddState} onAdded={() => this.onAdded()}/>
                <FunctionList
                    onEditClick={record => this.onEditClick(record)}
                    onAddChildClick={record => this.onAddChildClick(record)}
                    onDetailClick={record => this.onDetailClick(record)}
                    state={this.state.functionListState}
                />
            </div>
        );
    }
}
