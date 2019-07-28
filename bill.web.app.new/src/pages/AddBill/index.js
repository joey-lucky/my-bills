import * as React from "react";
import ToolBar from "@components/ToolBar";
import {action, computed, observable} from "mobx";
import {observer} from "mobx-react";
import Text from "@components/Text";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import Blank from "@components/Blank";
import TopList from "./TopList";
import TemplateList from "./TemplateList";
import BaseBillEdit from "@components/BaseBillEdit";
import AddBillContent from "@pages/AddBill/AddBillContent";
import CacheRouterContainer from "@components/CacheRouterContainer";

class AppState {
    data = ["模板", "支出", "收入", "其它"];
    @observable billTypeTypeName = this.data[1];

    @computed
    get selectPosition() {
        return this.data.findIndex(item => item === this.billTypeTypeName);
    }
}

@observer
export default class AddBill extends BaseBillEdit {
    _appState = new AppState();
    _billEditRef = null;

    onAddClick = (event) => {
        this._billEditRef.onSaveClick(event);
    };

    @action
    onTemplateItemClick = (item, index) => {
        this._billEditRef.changeValue(item);
        this._appState.billTypeTypeName = item.billTypeTypeName;
    };

    onTopItemClick = (item, index) => {
        this._appState.billTypeTypeName = item;
    };

    renderRightSave() {
        return (
            <Blank
                level={1}
                direction={"row"}
                onClick={this.onAddClick}
            >
                <Text
                    color={"#F6A724"}
                    type={"appBar"}>
                    <FontIcon
                        unicode={icons.confirm}/>
                </Text>
                <Text
                    text={"保存"}
                    color={"#F6A724"}
                    type={"title"}/>
            </Blank>
        );
    }

    render() {
        let {selectPosition, billTypeTypeName} = this._appState;
        return (
            <CacheRouterContainer
                style={styles.container}
                direction={"column"}
            >
                <ToolBar
                    title={"记一笔"}
                    rightExtra={selectPosition !== 0 && this.renderRightSave()}
                />
                <TopList
                    position={selectPosition}
                    data={this._appState.data}
                    onItemClick={this.onTopItemClick}
                />

                <div style={styles.content}>
                    <AddBillContent
                        {...this.props}
                        visible={selectPosition !== 0}
                        billTypeTypeName={billTypeTypeName}
                        wrappedComponentRef={(ref) => {
                            this._billEditRef = ref;
                        }}
                    />
                    {
                        selectPosition === 0 &&
                        <TemplateList
                            onItemClick={this.onTemplateItemClick}
                        />
                    }

                </div>
            </CacheRouterContainer>
        );

    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    content: {
        width: "100%",
        height: 0,
        flex: 1,
        backgroundColor: "#FCFCFC"
    },
};