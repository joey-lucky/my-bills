import * as React from "react";
import FormItem from "./FormItem";
import icons from "@res/icons";

export default function PickerFormItem(props) {
    const {label,children} = props;
    return (
        <FormItem
            style={{width: "100%", height: "100%"}}
            align={"center"}
            label={label}
            icon={icons.xe321}
            color={"#8880EF"}
        >
            {children}
        </FormItem>
    );
}