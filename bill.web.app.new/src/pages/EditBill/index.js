import * as React from "react";
import {Flex, Toast} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import {computed, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import Text from "@components/Text";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import BillEdit from "@components/BillEdit";
import Blank from "@components/Blank";
import Bottom from "./Bottom";
import {createForm} from "rc-form";
import {billListApi} from "../../services/api";
import moment from "moment";
import {RouteUtils} from "@utils/RouteUtils";

class AppState {
    @observable entity = {};
    @observable billType = BillEdit.INCOME;

    @computed
    get isTransferBill(){
        return this.billType === BillEdit.TRANSFER;
    }

    get isIncome(){
        return this.billType === BillEdit.INCOME;
    }

    asyncLoadEntity(id = "") {
        billListApi.getBillList({id: id}).then(d => {
            let entity = d.data && d.data[0] || {};
            //翻译datetime
            if (entity.dateTime) {
                entity.dateTime = moment(entity.dateTime).toDate();
            }
            if (entity.targetCardId) {
                this.billType = BillEdit.TRANSFER;
            }else if (entity.money >= 0) {
                this.billType = BillEdit.INCOME;
            }else{
                this.billType = BillEdit.OUTGOING;
            }
            this.entity =entity;
        })
    }

    async deleteBill(id = "") {
        await billListApi.deleteBill({id: id});
    }
}

@createForm()
@observer
export default class EditBill extends React.Component {
    _appState = new AppState();

    constructor(props) {
        super(props);
        let params = RouteUtils.getQueryObject(props.location);
        this.state = {
            id: params.id,
        };
    }

    componentDidMount() {
        this._appState.asyncLoadEntity(this.state.id);
    }

    onDeleteClick = (event) => {
        event.stopPropagation();
        this._appState.deleteBill(this.state.id).then(()=>{
            this.props.history.goBack();
        })
    };

    onSaveClick = (event) => {
        event.stopPropagation();
        this.props.form.validateFields((error, values) => {
            if (error) {
                Toast.info(Object.values(error)[0].errors[0].message, 2, null, false);
            } else {
                let value = {...values.value};
                value["dateTime"] = moment(value["dateTime"]).format("YYYY-MM-DD HH:mm:ss");
                if (this._appState.isIncome) {
                    value["money"] = 0 - value["money"];
                }
                billListApi.updateBill({"bd_bill": [{...this._appState.entity,...value}]}).then(d => {
                    this.props.history.goBack();
                });
            }
        });
    };

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <ToolBar
                    title={"编辑"}
                    rightExtra={(
                        <Blank
                            level={1}
                            direction={"row"}
                            onClick={this.props.onSaveClick}
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
                <div style={styles.content}>
                    <BillEdit
                        {...this.props.form.getFieldProps("value", {
                            initialValue: toJS(this._appState.entity)
                        })}
                        type={this._appState.billType}
                    />
                </div>
                <Bottom
                    isTransferBill={this._appState.isTransferBill}
                    onSaveClick={this.onSaveClick}
                    onChangeToTransferBillClick={this.onChangeToTransferBillClick}
                    onDeleteClick={this.onDeleteClick}
                />
            </Flex>
        );

    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        position:"absolute",
        backgroundColor:"white",
        top:0,
        left:0,
    },
    content: {
        width: "100%",
        height: 0,
        flex: 1,
        backgroundColor: "#FCFCFC"
    },
};