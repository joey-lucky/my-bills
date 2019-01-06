import * as React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import PropTypes from "prop-types";
import {observable} from "mobx";
import {Ajax} from "@utils/ajax";
import * as styles from "../OpTaskDetailDialog.css";
import {previewPhotoState} from "@components/PreviewPhotoDialog";

class AppState {
    @observable photoData = {};

    loadPhotoData = (taskId) => {
        this.photoData = {};
        Ajax.apiPost("/op/taskmanager/optask/get-photo-list", {TASK_ID: taskId})
            .then((d) => {
                let data = d.data || [];
                // 对照片进行分组
                let groupData = {};
                data.forEach((item, index) => {
                    let fileTag = item.FILE_TAG;
                    if (!groupData[fileTag]) {
                        groupData[fileTag] = [];
                    }
                    groupData[fileTag].push(item);
                });
                this.photoData = groupData;
            });
    };
}

@observer
export default class TaskPhotoDetail extends React.Component {
    static propTypes = {
        taskModel: PropTypes.string,
    };

    _appState = new AppState();

    componentDidMount() {
        let {taskModel} = this.props;
        this._appState.loadPhotoData(taskModel.ID);
    }

    componentWillReceiveProps(nextProps) {
        let {taskModel = {}} = this.props;
        let {taskModel: nextTaskModel = {}} = nextProps;
        if (taskModel !== nextTaskModel && taskModel.ID !== nextTaskModel.ID) {
            this._appState.loadPhotoData(nextTaskModel.ID);
        }
    }

    onPreviewPhotoClick = (url) => {
        previewPhotoState.url = url;
        previewPhotoState.visible = true;
    };

    render() {
        let {photoData} = this._appState;
        return (
            <Row>
                {
                    Object.keys(photoData)
                        .map((fileTag, index) =>
                            <div>
                                <Row><h2>{fileTag}</h2></Row>
                                <div className={styles.imgRow}>
                                    {
                                        photoData[fileTag].map(item =>
                                            <img
                                                onClick={() => {
                                                    this.onPreviewPhotoClick(window.getBasePath() + "/file" + item.FILE_URL)
                                                }}
                                                alt={fileTag}
                                                src={window.getBasePath() + "/file" + item.FILE_URL}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        )
                }
            </Row>
        );
    }
}


