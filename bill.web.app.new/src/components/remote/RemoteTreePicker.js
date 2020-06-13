import * as React from "react";
import {useState} from "react";
import * as PropTypes from "prop-types";
import {Flex, Picker} from "antd-mobile";
import Text from "@components/Text";
import icons from "@res/icons";
import FontIcon from "@components/FontIcon";
import colors from "@res/colors";
import fontSizes from "@res/fontSizes";
import {useRemoteFormState} from "./useRemoteFormState";
import {getTreeIndexByEndValue, getTreeItemsByIndexes, getTreeValuesByEndValue, parseData} from "./remote.util";

function getName(dataMap,value) {
    return dataMap[value] && dataMap[value].name || "";
}

export default function RemoteTreePicker(props) {
    const {data, value, setValue, dataMap,restProps} = useRemoteFormState(props);
    const [visible, setVisible] = useState(false);
    const indexes = getTreeIndexByEndValue(data, value);
    const items = getTreeItemsByIndexes(data, indexes);
    const labelData = parseData(data,{value:"id",label:"name"});//数据格式转换

    const onVisibleChange = (currVisible) => {
        if (visible !== currVisible) {
            setVisible(currVisible);
        }
    };
    const onPickerChange = (v) => {
        let value = v.pop();
        if (!("value" in props)) {
            setValue(value);
        }
        props.onChange && props.onChange(value);
    };
    const onClick = (e) => {
        e.stopPropagation();
        setVisible(true);
    };

    return (
        <React.Fragment>
            <Picker
                visible={visible}
                title={"请选择"}
                data={labelData}
                cols={props.cols}
                value={items.map(item => item.id)}
                onVisibleChange={onVisibleChange}
                onChange={onPickerChange}
            />
            <Flex
                {...props}
                direction={"row"}
                align={"center"}
                onClick={onClick}
            >
                {
                    items.map((item, index, array) =>
                        <React.Fragment key={item.id}>
                            <Text type={"title"} text={item.name}/>
                            {
                                index !== items.length - 1 &&
                                <FontIcon
                                    style={{
                                        fontSize: fontSizes.title,
                                        color: colors.divider,
                                        padding: "0 0.2rem"
                                    }}
                                    unicode={icons.right}
                                />
                            }
                        </React.Fragment>
                    )
                }
            </Flex>
        </React.Fragment>
    );
}

RemoteTreePicker.propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    loadData: PropTypes.func,
    parse: PropTypes.oneOfType([
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            children: PropTypes.any,
        }),
        PropTypes.func
    ]),
    params: PropTypes.any,
    extraOptions: PropTypes.array,
    onChange: PropTypes.func,
    label: PropTypes.string,
    cols: PropTypes.number,
};
