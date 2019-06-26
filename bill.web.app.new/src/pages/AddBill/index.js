import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import {observable} from "mobx";
import {observer} from "mobx-react";
import Text from "@components/Text";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import Blank from "@components/Blank";
import TopList from "./TopList";
import TemplateList from "./TemplateList";
import AddBillContent from "./AddBillContent";
class AppState {
    asyncLoadData() {

    }
}

@observer
export default class AddBill extends React.Component {
    @observable selectPosition = 1;

    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = (event) => {
        event.stopPropagation();
    };

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <ToolBar
                    title={"记一笔"}
                    rightExtra={(
                        <Blank
                            level={1}
                            direction={"row"}
                            onClick={this.props.onAddClick}
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
                    )}
                />
                <TopList
                    defaultPosition={this.selectPosition}
                    data={["模板", "支出", "收入", "转账", "还款", "借贷", "代付", "报销", "退款"]}
                    onItemClick={(item, index) => {
                        this.selectPosition = index;
                    }}
                />
                <div style={styles.content}>
                    {
                        this.selectPosition === 0 &&
                        <TemplateList/>
                    }
                    {
                        this.selectPosition !== 0 &&
                        <AddBillContent/>
                    }
                </div>
            </Flex>
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
        backgroundColor:"#FCFCFC"
    },
};