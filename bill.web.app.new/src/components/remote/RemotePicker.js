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
import {parseData} from "./remote.util";

export default function RemotePicker(props) {
    const {arrow=true} = props;
    let {data, value, setValue, dataMap,restProps} = useRemoteFormState(props);
    data = parseData(data,{value:"id",label:"name"});
    const name = dataMap[value] && dataMap[value].name || "";
    const [visible, setVisible] = useState(false);
    const onVisibleChange = (currVisible) => {
        if (visible !== currVisible) {
            setVisible(currVisible);
        }
    };
    const onPickerChange = (values) => {
        let value = [...values].pop();
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
                data={data}
                cols={1}
                value={[value]}
                onVisibleChange={onVisibleChange}
                onChange={onPickerChange}
            />
            <Flex
                {...props}
                direction={"row"}
                align={"center"}
                onClick={onClick}
            >
                <Text type={"title"} text={name}/>
                {
                    arrow &&
                    <FontIcon
                        style={{
                            fontSize: fontSizes.title,
                            color: colors.title,
                            padding: "0 0.2rem"
                        }}
                        unicode={icons.xe502}
                    />
                }

            </Flex>
        </React.Fragment>
    );
}

RemotePicker.propTypes = {
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
    extra: PropTypes.array,
    onChange: PropTypes.func,
    label: PropTypes.string,
    arrow:PropTypes.bool,
};
