import * as React from "react";
import * as PropTypes from "prop-types";
import {request} from "@utils/request";
import {ActionSheet, InputItem} from "antd-mobile";

export default class InputItemSelect extends React.Component {
    static propTypes = {
        extraOptions: PropTypes.any,
        url: PropTypes.any,
        parse: PropTypes.any,
        params: PropTypes.any,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const {value = ""} = nextProps;
        let id = prevState.ids[prevState.selectIndex]||"";
        if (value !== id) {
            let index = prevState.ids.indexOf(value);
            return {
                selectIndex: index
            }
        }
        return null;
    }

    constructor(props, ctx) {
        super(props);
        this.loadData(props);
        this.state = {
            ids: [],
            names: [],
            selectIndex: -1
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
            this.setState({ids, names});
        });
    }

    onClick = (e) => {
        let {names,ids} = this.state;
        ActionSheet.showActionSheetWithOptions({
                options: names,
            },
            (buttonIndex) => {
                ActionSheet.close();
                this.setState({
                    selectIndex:buttonIndex,
                });
                this.props.onChange && this.props.onChange(ids[buttonIndex]);
            });
    };

    render() {
        const {
            editable, children, onClick,
            ...props
        } = this.props;
        let value = this.state.names[this.state.selectIndex]|| "";
        return (
            <InputItem
                {...props}
                value={value}
                onClick={this.onClick}
                ref={(c) => this._component = c}
                editable={false}>
                {children}
            </InputItem>
        );
    }

    //无视props
    shouldComponentUpdate(nextProps,nextState,nextContext){
        if (JSON.stringify(nextState) !== JSON.stringify(this.state)) {
            return true;
        }
        let {value:nextValue,...props1} = nextProps;
        let {value,...props2} = this.props;
        if (JSON.stringify(props1) !== JSON.stringify(props2)) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {url = "", parse = {}, params = {}} = this.props;
        const {url: preUrl = "", parse: preParse = {}, params: preParams = {}} = prevProps;
        if (url !== preUrl
            || JSON.stringify(parse) !== JSON.stringify(preParse)
            || JSON.stringify(params) !== JSON.stringify(preParams)
        ) {
            this.loadData(this.props);
        }
    }
}
