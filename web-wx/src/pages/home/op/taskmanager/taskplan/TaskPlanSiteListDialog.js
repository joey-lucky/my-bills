import {Table} from "antd";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import React from "react";
import {FormDialog, FormDialogState} from "@components/FormDialog";

class AppState extends FormDialogState {
    @observable data = [];


    show = () => {
        super.show();
    };

    hide = () => {
        super.hide();
    };
}

@observer
export default class TaskPlanSiteListDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 750;
        this.columns = [
            {
                title: "站点名称",
                dataIndex: "NAME",
                key: "NAME"
            }
        ];
    }

    static newState() {
        return new AppState();
    }

    renderForm() {
        const {state} = this.props;
        return (
            <Table
                rowKey={record => record.ID}
                dataSource={toJS(state.data) || []}
                columns={this.columns}
            />
        );
    }
}
