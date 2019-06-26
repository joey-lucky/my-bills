import * as React from "react";
import {Flex} from "antd-mobile";
import {observable} from "mobx";
import {observer} from "mobx-react";
import fontSizes from "@res/fontSizes";
import Bottom from "./Bottom";
import RemarkInput from "@pages/AddBill/AddBillContent/input/RemarkInput";

class AppState {
    @observable data = [];
    @observable total = {
        total: "0",
        asset: "0",
        credit: "0",//信用卡
    };

    asyncLoadData() {

    }
}

@observer
export default class AddBillContent extends React.Component {
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
                <Flex style={styles.moneyContainer}>
                    <input
                        style={styles.money}
                        defaultValue={"0"}
                        type={"number"}
                        min={0}
                    />
                </Flex>
                <Flex
                    style={styles.itemContainer}
                    direction={"column"}
                >
                    <RemarkInput/>
                    <RemarkInput/>
                    <RemarkInput/>
                    <RemarkInput/>
                </Flex>
                <Bottom/>
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
        height: 0,
        width: "100%",
        flex: 1,
        overflowY: "auto"
    },
    moneyContainer:{
        height:"3.15rem",
        paddingLeft:"0.86rem",
        width:"100%",
    },
    money:{
        width:"100%",
        height:"100%",
        lineHeight:"3.15rem",
        fontSize:fontSizes.display4,
        paddingLeft:"0.1rem",
        paddingTop:"0.5rem",
        background:"none",
        borderTop:"none",
        borderRight:"none",
        borderLeft:"none",
        borderBottom:"0.04rem #F4BFB7 solid",
        color:"#F1533A",
        fontWeight:"bold",
    },
    itemContainer:{
        width:"100%",
        flex:1,
        height:0,
        marginTop:"0.5rem",
        paddingLeft:"0.9rem",
    },
};