import * as React from "react";
import {withRouter} from "react-router-dom";
import * as PropTypes from "prop-types";
import {parsePath} from "history";

@withRouter
export default class CacheRoute extends React.Component {
    static propTypes = {
        path: PropTypes.any,
        defaultRoute: PropTypes.any,
    };

    _component;

    _getPathName(props) {
        if (props.location) {
            return parsePath(props.location.pathname).pathname;
        } else {
            return "";
        }
    }

    _calculateIsMatch(props) {
        let {path, match} = props;
        let parentPath = match.path;
        // 出去匹配后剩下的地址
        let pathname = this._getPathName(props);
        pathname = pathname.substr(parentPath.length);
        path = path.substr(1);

        // 根据path生成正则表达式
        let split = path.split("\/");
        let regex = "";
        split.forEach((item) => {
            // 以分号开头
            if (/^[:]+\w/.test(item)) {
                regex += "\/*";
            } else {
                regex += "\/" + item;
            }
        });
        return new RegExp(regex).test(pathname);
    }

    _calculateRouteParams(props) {
        const {path, match} = props;
        let pathname = this._getPathName(props);
        let parentPath = match.path;

        let routeParams = {};
        if (new RegExp("\/:[a-z0-9]+").test(path)) {
            let pathMatch = pathname.replace(parentPath, "");
            let pathSplit = path.split("\/");
            let matchSplit = pathMatch.split("\/");
            pathSplit.forEach((item, index) => {
                if (new RegExp(":[a-z0-9]+").test(item)) {
                    let paramKey = item.substr(1, item.length);
                    let paramValue = matchSplit[index];
                    routeParams[paramKey] = paramValue;
                }
            });
        }
        return routeParams;
    }

    constructor(props) {
        super(props);
        let {path, match, history, defaultRoute} = props;
        let show = this._calculateIsMatch(props);
        let routeParams = {};
        if (show) {
            routeParams = this._calculateRouteParams(props);
        }
        // 如果是默认路由，且只匹配到父类，则默认跳转
        if (defaultRoute) {
            history.push(match.path + path);
        }
        this.state = {
            show: show,
            routeParams: routeParams
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let pathName = this._getPathName(this.props);
        let nextPathName = this._getPathName(nextProps);
        if (pathName !== nextPathName) {
            let show = this._calculateIsMatch(nextProps);
            let routeParams = {};
            if (show) {
                routeParams = this._calculateRouteParams(nextProps);
            }
            let newState = {
                show: show,
                routeParams: routeParams
            };
            if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
                this.setState({
                    show: show,
                    routeParams: routeParams
                });
                this._component &&
                this._component.onRouteLifecycle &&
                this._component.onRouteLifecycle(show);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.state) !== JSON.stringify(nextState);
    }

    render() {
        let styles = {
            width: "100%",
            height: "100%"
        };
        if (!this.state.show) {
            styles.display = "none";
        }
        return (
            <div style={styles}>
                <this.props.component
                    ref={(c) => {
                        this._component = c;
                    }}
                    match={this.props.match}
                    history={this.props.history}
                    routeParams={this.state.routeParams}
                />
            </div>
        );
    }
}
