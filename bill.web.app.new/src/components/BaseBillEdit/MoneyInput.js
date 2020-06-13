import * as React from "react";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";
import {useFormState} from "@components/useFormState";

export default function MoneyInput(props) {
    /*
    state
     */
    const [value, setValue] = useFormState(props);

    /*
    事件
     */
    const onChange = (event) => {
        let targetValue = event.target.value || "";
        if (/^(([0]?)|(0\.[0-9]*)|([1-9][0-9]*[\.]?[0-9]*))$/.test(targetValue)) {
            if (!("value" in props)) {
                setValue(targetValue);
            }
            props.onChange && props.onChange(targetValue);
        } else {
            setValue(value);
        }
    };

    let style = {
        ...styles.money,
        color: props.color,
        borderBottom: "0.04rem solid " + props.color
    };

    return (
        <Flex style={styles.container}>
            <input
                value={value}
                onChange={onChange}
                style={style}
                placeholder={""}
            />
        </Flex>
    );
}

const styles = {
    container: {
        height: "3.15rem",
        paddingLeft: "0.86rem",
        width: "100%",
    },
    money: {
        width: "100%",
        height: "100%",
        lineHeight: "3.15rem",
        fontSize: fontSizes.display4,
        border: "none",
        borderRight: "none",
        borderLeft: "none",
        fontWeight: "bold",
    },
};