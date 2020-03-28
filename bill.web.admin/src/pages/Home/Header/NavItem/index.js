import * as React from "react";
import * as PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import icData from "./ic_data.png";
import icHome from "./ic_home.png";
import icOperation from "./ic_operation.png";
import icSysSetting from "./ic_sys_setting.png";
import * as styles from "./index.module.css";

@withRouter
export default class NavItem extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        history: PropTypes.any,
        location: PropTypes.any,
        match: PropTypes.any,
    };

    _icon = {
        "首页": icHome,
        "数据监控": icData,
        "信息填报": icOperation,
        "信息维护": icSysSetting,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {selected: this.calculateIsSelected(props.location)};
    }

    componentDidMount() {
        this.props.history.listen((location, action) => {
            this.setState({
                selected: this.calculateIsSelected(location)
            });
        });
    }

    getCompletePath() {
        return this.props.match.path + this.props.path;
    }

    calculateIsSelected(location) {
        let path = this.getCompletePath();
        let pathname = location.pathname || "";
        return pathname.startsWith(path);
    }

    onClick = (e) => {
        e.stopPropagation();
        if (!this.state.selected) {
            this.props.history.push(this.getCompletePath());
        }
    };

    render() {
        let {name} = this.props;
        let {path: parentPath} = this.props.match;
        console.log("render parentPath", parentPath);
        let icon = this._icon[name] || icHome;
        return (
            <div
                className={`${styles.tabItem} ${this.state.selected && styles.selected}`}
                onClick={this.onClick}
            >
                <img
                    alt={""}
                    style={{height: 14, marginRight: 6}}
                    src={icon}
                />
                {name}
            </div>
        );
    }
}
