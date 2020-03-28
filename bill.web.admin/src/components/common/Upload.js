import React from "react";
import {Upload as AntUpload} from "antd";
import * as PropTypes from "prop-types";
import UUID from "@utils/UUID";

/**
 * 仅支持表单
 */
export default class Upload extends React.Component {
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
    };

    static toValueByFileTable(bdFileList = [], filePreviewPrefix = "") {
        let fileList = [];
        for (let bdFile of bdFileList) {
            let {} = bdFile;
            let url = filePreviewPrefix + bdFile["FILE_URL"];
            fileList.push({
                uid: UUID.randomUUID(16),
                name: bdFile["NAME"],
                status: 'done',
                url: url,
                thumbUrl: url,
                fileTable: bdFile,
            })
        }
        return {
            fileList: fileList
        };
    }

    static toFileTableByValue(value = {}, filePreviewPrefix = "") {
        let {fileList = []} = value;
        let fileTableList = [];
        for (let file of fileList) {
            if (file.fileTable) {
                fileTableList.push(file.fileTable);
            } else {
                let name = file.name || "";
                let url = file.response &&
                    file.response.data &&
                    file.response.data[0] &&
                    file.response.data[0].url || "";
                let sizeM = (file.size / (1 << 20)).toFixed(2)
                fileTableList.push({
                    NAME: file.name,
                    FILE_URL: url,
                    FILE_SIZE: sizeM,
                    FILE_TYPE: file.type,
                    FILE_SUFFIX: file.name.split(".").pop(),
                });
            }
        }
        return fileTableList;
    }

    render() {
        const {value = {}, ...props} = this.props;
        const {fileList = []} = value;
        return (
            <AntUpload
                {...props}
                fileList={fileList}
            >
                {this.props.children}
            </AntUpload>
        );
    }
}

