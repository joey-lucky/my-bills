import * as React from "react";
import {useContext} from "react";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import request from "@utils/request";
import {ActionSheet, InputItem} from "antd-mobile";
import {observable, runInAction, toJS} from "mobx";

const NULL = "DOMAIN_SELECT_NULL";

@observer
export default class InputItemSelect extends React.Component {
    @observable appState = {
        ids: [],
        names: [],
        value: ""
    };

    static contextTypes = {
        request: PropTypes.any
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("InputItemSelect", "getDerivedStateFromProps");

        if (nextProps.type !== prevState.type) {
            return {
                type: nextProps.type,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {value:preValue} = prevProps;
        const {value} = this.props;


    }



    static propTypes = {
        extraOptions: PropTypes.any,
        url: PropTypes.any,
        parse: PropTypes.any,
        params: PropTypes.any,
    };

    _component;
    _data = [];

    constructor(props, ctx) {
        super(props);
        console.log(ctx);
        this.appState.value = props.value || "";
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value !== this.props.value) {


        }
    }


    loadData(props) {
        const {url, parse, params, extraOptions} = props;
        request(url, params).then((d) => {
            let data = d.data || [];
            if (parse) {
                let {id = "id", name = "name"} = parse;
                data = data.map((item) => {
                    return {
                        id: item[id],
                        name: item[name],
                    }
                })
            }
            if (extraOptions) {
                if (Array.isArray(extraOptions)) {
                    data = [...extraOptions, ...data];
                } else {
                    data = [extraOptions, data];
                }
            }
            let ids = [];
            let names = [];
            data.forEach((item) => {
                ids.push(item.id);
                names.push(item.name);
            });
            runInAction(() => {
                this.appState.ids = ids;
                this.appState.names = names;
            });
        });
    }

    onClick = (e) => {
        let buttons = toJS(this.appState.names);
        ActionSheet.showActionSheetWithOptions({
                options: buttons,
            },
            (buttonIndex) => {
                ActionSheet.close();
                console.log(this._component);
                this._component.value = buttons[buttonIndex];
            });
    };

    render() {
        const {
            editable, children, onClick,
            ...props
        } = this.props;
        return (
            <InputItem
                {...props}
                onClick={this.onClick}
                ref={(c) => this._component = c}
                editable={false}>
                {children}
                <Test/>
            </InputItem>
        );
    }
}

function Test() {
    console.log(Object.keys(React))

    ;
    const ctx = useContext({
        request: PropTypes.any
    });

    console.log(ctx);
    return null;
}