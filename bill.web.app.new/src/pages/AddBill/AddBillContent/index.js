import * as React from "react";
import {ActivityIndicator, Flex, Toast,Modal} from "antd-mobile";
import {action, computed, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import BaseBillEdit from "@components/BaseBillEdit";
import {addBillApi} from "../../../services/api";
import moment from "moment";
import Bottom from "@pages/AddBill/Bottom";
import * as PropTypes from "prop-types";
import createForm from "rc-form/es/createForm";

class AppState {
    @observable activityIndicatorState = {
        text: "",
        animating: false,
    };
    @observable value = {
        dateTime: new Date()
    };

    @computed
    get selectPosition() {
        return this.data.findIndex(item => item === this.billTypeTypeName);
    }

    @action
    asyncSaveTemplate(values) {
        this.activityIndicatorState.text = "保存模板...";
        this.activityIndicatorState.animating = true;
        let params = {
            data: JSON.stringify([values])
        };
        return addBillApi.createBillTemplate(params).then(() => {
            this.activityIndicatorState.animating = false;
        });
    }

    @action
    async saveBill(error, values,billTypeTypeName) {
        try{
            if (error) {
                let firstError = Object.values(error)[0].errors[0];
                Toast.fail(firstError.message, Toast.SHORT);
                throw firstError;
            } else {
                let saveData = {...values};
                saveData["dateTime"] = moment(saveData["dateTime"]).format("YYYY-MM-DD HH:mm:ss");
                if (billTypeTypeName !== "收入") {
                    saveData["money"] = 0 - saveData["money"];
                }
                this.activityIndicatorState.text = "保存账单...";
                this.activityIndicatorState.animating = true;
                await addBillApi.createBill({"data": [saveData]});
                this.activityIndicatorState.animating = false;
                Toast.success("保存成功", Toast.SHORT);
            }
        }catch (e) {
            this.activityIndicatorState.animating = false;
            throw e;
        }
    }
}

@createForm()
@observer
export default class AddBillContent extends BaseBillEdit {
    static propTypes = {
        visible: PropTypes.bool,
        billTypeTypeName: PropTypes.string,
    };

    _appState = new AppState();

    changeValue = (value) => {
        if (!value.dateTime) {
            value.dateTime = new Date();
        }
        this._appState.value = value;
    };

    onSaveAgainClick = (event) => {
        event.stopPropagation();
        this.props.form.validateFields((error, values) => {
            this._appState.saveBill(error, values,this.props.billTypeTypeName).then();
        });
    };

    onSaveClick = (event) => {
        event.stopPropagation();
        this.props.form.validateFields((error, values) => {
            this._appState.saveBill(error, values,this.props.billTypeTypeName).then(
                () => {
                    this.props.history.goBack();
                }
            );
        });
    };

    onSaveTemplateClick = () => {
        let values = this.props.form.getFieldsValue();
        Modal.prompt('模板名称', '',
            [
                {
                    text: '取消',
                    onPress: () => {

                    },
                },
                {
                    text: '保存',
                    onPress: (name) =>{
                        values = {...values, name: name};
                        this._appState.asyncSaveTemplate(values).then(() => {
                            Toast.info("保存成功", Toast.SHORT);
                        });
                    },
                },
            ], 'default', null, ['input your name']);
    };

    getFieldProps = (id, opt = {}) => {
        opt.initialValue = this._appState.value[id] || "";
        return this.props.form.getFieldProps(id, opt);
    };

    render() {
        let {visible, billTypeTypeName} = this.props;
        let {activityIndicatorState} = this._appState;
        activityIndicatorState = toJS(activityIndicatorState);
        return (
            <Flex
                style={visible ? styles.container : styles.hide}
                direction={"column"}>
                <ActivityIndicator
                    {...activityIndicatorState}
                    toast={true}
                    size={"large"}
                />
                <div style={styles.content}>
                    {
                        this.renderContent(billTypeTypeName)
                    }
                </div>
                <Bottom
                    onSaveAgainClick={this.onSaveAgainClick}
                    onSaveClick={this.onSaveClick}
                    onSaveTemplateClick={this.onSaveTemplateClick}
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
    hide: {
        display: "none"
    },
    content: {
        flex: 1,
        width: "100%",
        height: 0
    }
};