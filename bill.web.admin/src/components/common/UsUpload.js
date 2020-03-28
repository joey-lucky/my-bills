import React from "react";
import {Button, Icon, message, Upload} from "antd";
import * as PropTypes from "prop-types";
import {getFilePath} from "@global";

/**
 * 文件上传组件，实现文件数量控制，只能上传单个文件，配合antd的form组件，实现值的回传
 */
class UsUpload extends React.Component {
    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.any,
        uploadUrl: PropTypes.any
    };
    constructor(props) {
        super(props);

        let fileList = [];

        if (props.value != null) {

            let fileName = this.getFileName(props.value);

            let thumbUrl = getFilePath() + props.value;

            fileList.push({
                uid: 1,
                name: fileName,
                thumbUrl: thumbUrl
            });
        }

        this.state = {
            fileList: fileList
        };
    }

    getFileName(url) {

        if (url == null) {
            return null;
        }

        let urlInfos = url.split("/");
        let fileName = urlInfos[urlInfos.length - 1];
        return fileName;
    }

    onChange(obj) {

        let fileList = obj.fileList;

        /**
         * 限制文件只能传一个
         */
        fileList = fileList.slice(-1);

        if (this.checkField(obj)) {
            this.targetValueChange(obj);
            this.setState({fileList});
        }
        if (obj.file.status) {
            this.setState({fileList});
        }
        if (obj.file.status === "done") {
            message.success(`${obj.file.name} file uploaded successfully`);
        } else if (obj.file.status === "error") {
            message.error(`${obj.file.name} file upload failed.`);
        }

        if (obj.file.response) {
            this.targetValueChange(obj);
        }
    }

    checkField(obj) {
        let fileName = obj.name;
        if (fileName == null) {
            return false;
        }
        if (fileName.indexOf(" ") >= 0) {
            alert("文件名不能有空格");
            return false;
        }
    }

    onRemove(file) {
        const onChange = this.props.onChange;

        if (onChange) {
            onChange(null);
        }
    }

    targetValueChange(obj) {
        let response = obj.file.response;

        if (response == null) {
            return;
        }

        if (response.data.length <= 0) {
            return;
        }

        let url = response.data[0].url;

        const onChange = this.props.onChange;

        if (onChange) {
            onChange(url);
        }
    }

    render() {
        const {uploadUrl} = this.props;
        return (
            <Upload
                fileList={this.state.fileList}
                accept=".png,.jpg,.jpeg,.docx,.doc,.xlsx,.xls,.xls,.pdf,.txt"
                action={uploadUrl}
                onRemove={file => this.onRemove(file)}
                onChange={obj => this.onChange(obj)}
                beforeUpload={file => this.checkField(file)}
            >
                <Button>
                    <Icon type="upload"/> 上传文件
                </Button>
            </Upload>
        );
    }
}

export default UsUpload;
