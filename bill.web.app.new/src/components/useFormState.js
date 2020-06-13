import {useEffect, useState} from "react";

export function useFormState(props) {
    const [value,setValue] = useState(props.value || props.defaultValue);

    useEffect(() => {
        setValue(props.value)
    }, [props.value]);

    return [value, setValue];
}