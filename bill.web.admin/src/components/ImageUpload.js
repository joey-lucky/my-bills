import React from "react";
import {Button, Icon, Upload} from "antd";
import * as PropTypes from "prop-types";
import {filePath, getUploadPath} from "@global";

/**
 * 文件上传组件，实现文件数量控制，只能上传单个文件，配合antd的form组件，实现值的回传
 */
class ImageUpload extends React.Component {
    static propTypes = {
        onChange: PropTypes.any,
        value: PropTypes.any
    };

    constructor(props) {
        super(props);
        this.state = {
            fileList: []
        };
        let fileList = [];
        if (props.value) {
            let fileName = this.getFileName(props.value);
            let thumbUrl = filePath + props.value;
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

    componentWillReceiveProps(nextProps, nextContext) {


    }

    /**
     * 根据URL地址，解析成文件名
     * @param url
     * @returns 文件名，nullable
     */
    getFileName = (url) => {
        if (url === null) {
            return null;
        }
        let urlInfos = url.split("/");
        return urlInfos[urlInfos.length - 1];
    };


    checkField = (file, fileList) => {
        let fileName = file.name;
        if (fileName === null) {
            return false;
        }
        if (fileName.indexOf(" ") >= 0) {
            alert("文件名不能有空格");
            return false;
        }
        return true;
    };


    targetValueChange(obj) {

        var response = obj.file.response;

        if (response == null) {
            return;
        }

        if (response.data.length <= 0) {
            return;
        }

        var url = response.data[0].url;

        const onChange = this.props.onChange;

        if (onChange) {
            onChange(url);
        }
    }

    onChange = (obj) => {
        let fileList = obj.fileList;

        /**
         * 限制文件只能传一个
         */
        fileList = fileList.slice(-1);

        if (obj.file.status) {
            this.setState({fileList});
        }

        if (obj.file.response) {
            this.targetValueChange(obj);
        }
    };

    onRemove = (file) => {
        const onChange = this.props.onChange;

        if (onChange) {
            onChange(null);
        }
    };

    render() {
        return (
            <Upload
                fileList={this.state.fileList}
                accept="image/*"
                listType='picture'
                action={getUploadPath() + "/station/photo"}
                onRemove={this.onRemove}
                onChange={this.onChange}
                beforeUpload={(file, fileList) => this.checkField(file, fileList)}
            >
                <Button>
                    <Icon type="upload"/> 上传图片
                </Button>
            </Upload>
        );
    }
}

export default ImageUpload;
