import * as React from "react";
import {ActivityIndicator, Flex, Toast} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import {action, computed, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import Text from "@components/Text";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import BaseBillEdit from "@components/BaseBillEdit";
import Blank from "@components/Blank";
import Bottom from "./Bottom";
import {createForm} from "rc-form";
import moment from "moment";
import {RouteUtils} from "@utils/RouteUtils";
import strings from "@res/strings";
import {billAPI} from "../../services";
import {waitDialogStore} from "../../stores";

class AppState {
    @observable entity = {};
    @observable billType = strings.income;

    @computed
    get isTransferBill() {
        return this.billType === strings.other;
    }

    @computed
    get billTypeTypeName() {
        return this.entity.billTypeTypeName || strings.income;
    }

    asyncLoadEntity(id = "") {
        billAPI.index({id: id}).then(d => {
            let entity = d.data && d.data[0] || {};
            //翻译datetime
            if (entity.dateTime) {
                entity.dateTime = moment(entity.dateTime).toDate();
            }
            entity.money = Math.abs(entity.money);
            this.entity = entity;
        })
    }

    @action
    async updateBill(error, values) {
        try {
            if (error) {
                let firstError = Object.values(error)[0].errors[0];
                Toast.fail(firstError.message, Toast.SHORT);
                throw firstError;
            } else {
                let saveData = {
                    ...values,
                    id: this.entity.id,
                };
                saveData["dateTime"] = moment(saveData["dateTime"]).format("YYYY-MM-DD HH:mm:ss");
                if (this.billTypeTypeName !== "收入") {
                    saveData["money"] = 0 - saveData["money"];
                }
                waitDialogStore.show("保存账单...");
                await billAPI.update(saveData);
                waitDialogStore.hide();
                Toast.success("更新成功", Toast.SHORT);
            }
        } catch (e) {
            waitDialogStore.hide();
            throw e;
        }
    }

    asyncDeleteBill() {
        waitDialogStore.show("更新账单...");
        return billAPI.destroy({id: this.entity.id}.id).then((d) => {
            waitDialogStore.hide();
            return d;
        });
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
        this._appState.asyncDeleteBill(this.state.id).then(() => {
            Toast.info("删除成功", Toast.SHORT);
            this.props.history.goBack();
        })
    };

    onSaveClick = (event) => {
        event.stopPropagation();
        this.props.form.validateFields((error, values) => {
            this._appState.updateBill(error, values).then(() => {
                this.props.history.goBack();
            });
        });
    };

    getFieldProps = (id, opt = {}) => {
        opt.initialValue = this._appState.entity[id];
        return this.props.form.getFieldProps(id, opt);
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
                            onClick={this.onSaveClick}
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
                    <BaseBillEdit
                        value={this._appState.entity}
                        form={this.props.form}
                        typeName={this._appState.entity.billTypeTypeValue}
                    />
                </div>
                <Bottom
                    isTransferBill={this._appState.isTransferBill}
                    onSaveClick={this.onSaveClick}
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
    },
    content: {
        width: "100%",
        height: 0,
        flex: 1,
        backgroundColor: "#FCFCFC"
    },
};