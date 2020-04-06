import React from "react";
import {action, observable, toJS} from "mobx";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import {Form} from "antd";
import Dialog from "./Dialog/index";

let formNameIndex = 0;

@observer
export default class DetailDialog extends React.Component {
    static propTypes = {
        // 请求
        actionURL: PropTypes.string.isRequired,
        onFinish: PropTypes.func,
        onFinishFailed: PropTypes.func,

        // Dialog 属性
        okText: PropTypes.node,
        cancelText: PropTypes.node,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.node,

        // Form
        labelCol: PropTypes.object,
        wrapperCol: PropTypes.object,
        layout: PropTypes.string,
        children: PropTypes.node,

        successMessage: PropTypes.string,
    };

    static defaultProps = {
        title: "提示",
        width: 520,
        okText: "确定",
        cancelText: "取消",
        actionURL: "",
        labelCol: null,
        wrapperCol: null,
        layout: null,
        children: null,
    };

    @observable appState = {
        visible: false,
        data: {},
    };

    formName = "DetailDialog" + (++formNameIndex);

    onCancelClick = () => {
        this.hide();
    };

    @action show(data = {}) {
        this.appState.data = data;
        this.appState.visible = true;
    }

    @action hide() {
        this.appState.visible = false;
    }


    renderDetail(data) {
        return null;
    }

    render() {
        const {
            title = "提示",
            width = 520,
        } = toJS(this.props);
        const {visible,data} = toJS(this.appState);
        const {labelCol, wrapperCol, layout} = this.props;
        return (
            <Dialog
                visible={visible}
                title={title}
                width={width}
                maskClosable={false}
                destroyOnClos={true}
                onCancel={this.onCancelClick}
                forceRender={false}
                footer={[]}
            >
                <Form
                    name={this.formName}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    layout={layout}
                >
                    {this.renderDetail(data)}
                </Form>
            </Dialog>
        );
    }
}
