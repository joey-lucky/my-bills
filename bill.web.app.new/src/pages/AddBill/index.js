import * as React from "react";
import {Flex, Toast} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import {observable} from "mobx";
import {observer} from "mobx-react";
import Text from "@components/Text";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import Blank from "@components/Blank";
import TopList from "./TopList";
import TemplateList from "./TemplateList";
import Bottom from "@pages/AddBill/Bottom";
import BillEdit from "@components/BillEdit";
import {createForm} from "rc-form";
import {addBillApi} from "../../services/api";
import moment from "moment";

@createForm()
@observer
export default class AddBill extends React.Component {
    data = ["模板", "支出", "收入", "其它", "支出", "收入", "其它", "支出", "收入", "其它"];
    @observable selectPosition = 1;
    @observable value = {};

    onAddClick = (event) => {
        event.stopPropagation();
    };

    onSaveAgainClick = () => {

    };

    onSaveClick = () => {
        this.props.form.validateFields((error, values) => {
            if (error) {
                Toast.info(Object.values(error)[0].errors[0].message, 2, null, false);
            } else {
                let value = {...values.value};
                let type = this.data[this.selectPosition];
                value["dateTime"] = moment(value["dateTime"]).format("YYYY-MM-DD HH:mm:ss");
                if (type !== "收入") {
                    value["money"] = 0 - value["money"];
                }
                addBillApi.createBill({"bd_bill": [value]}).then(d => {
                });
            }
        });
    };

    onSaveTemplateClick = () => {


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
                    data={this.data}
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
                        <BillEdit
                            {...this.props.form.getFieldProps("value")}
                            type={this.data[this.selectPosition]}
                        />
                    }
                </div>
                {
                    this.selectPosition !== 0 &&
                    <Bottom
                        onSaveAgainClick={this.onSaveAgainClick}
                        onSaveClick={this.onSaveClick}
                        onSaveTemplateClick={this.onSaveTemplateClick}
                    />
                }
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
        backgroundColor: "#FCFCFC"
    },
};