import * as React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Flex, Icon, InputItem, List, ListView, NavBar, TextareaItem} from "antd-mobile";
import {createForm} from 'rc-form';
import {billApi, tableController} from "@services/api";
import PickerItem from "@components/PickerItem";
import {Toast}  from "antd-mobile";
import TopBar from "./TopBar";
import BillList from "../comp/BillList";

class AppState {
    @observable initData = {};


    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {

    }

    asyncSaveData(values) {
        return tableController.add("bc_card_type",values);
    }
}

@observer
export default class BillTypeAdd extends React.Component {
    _appState = new AppState();

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Flex
                style={{height: "100%"}}
                direction={"column"}
                align={"center"}>
                <TopBar title={"卡类型新增/编辑"}/>
                <BillList/>
            </Flex>
        )
    }
}
