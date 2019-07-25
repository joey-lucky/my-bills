import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex, Picker} from "antd-mobile";
import Text from "@components/Text";
import icons from "@res/icons";
import FontIcon from "@components/FontIcon";
import colors from "@res/colors";
import fontSizes from "@res/fontSizes";
import useRemoteDataState from "@utils/useRemoteDataState";
import {useState} from "react";

export default function TablePicker(props) {
    const {data,idList,nameList,changeValue} = useRemoteDataState(props,{idKey:"value",nameKey:"label"});
    const [visible,setVisible] = useState(false);

    const onVisibleChange = (currVisible) => {
        if (visible !== currVisible) {
            setVisible(currVisible);
        }
    };

    const onPickerChange = (values) => {
        let value = [...values].pop();
        if (!"value" in props) {
            changeValue(value);
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
                cols={props.cols}
                value={idList}
                onVisibleChange={onVisibleChange}
                onChange={onPickerChange}
            />
            <Flex
                style={{width: "100%", height: "100%",backgroundColor:"grey"}}
                direction={"row"}
                align={"center"}
                onClick={onClick}
            >
                {
                    nameList.map((item, index, array) =>
                        <React.Fragment key={item + index}>
                            <Text type={"title"} text={item}/>
                            {
                                index !== array.length - 1 &&
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

TablePicker.propTypes = {
    label: PropTypes.string.isRequired,
    cols: PropTypes.number,
    onChange: PropTypes.any,
    value: PropTypes.any,
    url: PropTypes.any,
    parse: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        children: PropTypes.any,
    }),
    params: PropTypes.any,
    data: PropTypes.any,
};

