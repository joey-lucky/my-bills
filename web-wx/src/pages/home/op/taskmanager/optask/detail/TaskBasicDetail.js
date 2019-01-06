import * as React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import PropTypes from "prop-types";
import {observable} from "mobx";
import {Ajax} from "@utils/ajax";

class AppState {
    @observable positionInfo = {};

    loadPositionData = (taskId="") => {
        this.positionInfo = {};
        Ajax.apiPost("/op/taskmanager/optask/get-position-list", {TASK_ID: taskId})
            .then((d) => {
                let data = d.data || [];
                if (data && data.length > 0) {
                    this.positionInfo = data[0] || {};
                } else {
                    this.positionInfo = {};
                }
            });
    };
}

@observer
export default class TaskBasicDetail extends React.Component {
    static propTypes = {
        taskModel: PropTypes.string,
    };

    _appState = new AppState();

    componentDidMount() {
        let {taskModel} = this.props;
        this._appState.loadPositionData(taskModel.ID);
    }

    componentWillReceiveProps(nextProps) {
        let {taskModel = {}} = this.props;
        let {taskModel:nextTaskModel = {}} = nextProps;
        if (taskModel !== nextTaskModel && taskModel.ID !== nextTaskModel.ID) {
            this._appState.loadPositionData(nextTaskModel.ID);
        }
    }

    render() {
        let {taskModel} = this.props;
        const {positionInfo} = this._appState;
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true
        };
        const wholeRowLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
            style: {width: "100%"},
            colon: true
        };
        return (
            <React.Fragment>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            {...layout}
                            label="运维站点"
                        >
                            {taskModel.SITE_ID_DESC}
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item
                            {...layout}
                            label="任务下发时间"
                        >
                            {taskModel.START_TIME}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            {...layout}
                            label="运维组"
                        >
                            {taskModel.GROUP_ID_DESC}
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item
                            {...layout}
                            label="任务完成时间"
                        >
                            {taskModel.FINISH_TIME}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            {...layout}
                            label="运维人员"
                        >
                            {taskModel.FINISH_BY_DESC}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...wholeRowLayout}
                            label="任务描述"
                        >
                            {taskModel.TASK_DESC}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...wholeRowLayout}
                            label="定位地址"
                        >
                            {positionInfo.ADDRESS}
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}
