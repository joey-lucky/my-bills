import * as React from "react";
import {withRouter} from "react-router-dom";
import * as PropTypes from "prop-types";

@withRouter
export default class CacheRoute extends React.Component {
    static calculateIsMatch(props) {
        let {path, match, location} = props;
        let {pathname} = location;
        let parentPath = match.path;

        // 出去匹配后剩下的地址
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

    static calculateRouteParams(props) {
        const {path, match, location} = props;
        const {pathname} = location;
        const parentPath = match.path;

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

    static propTypes = {
        path: PropTypes.any,
        match: PropTypes.any,
        history: PropTypes.any,
        location: PropTypes.any,
        defaultRoute: PropTypes.any
    };

    constructor(props, context) {
        super(props, context);
        // 解析路径path
        let show = CacheRoute.calculateIsMatch(this.props);
        let routeParams = {};
        if (show) {
            routeParams = CacheRoute.calculateRouteParams(this.props);
        }
        this.state = {
            show: show,
            routeParams: routeParams
        };
    }

    componentDidMount() {
        let {path, match, history, location, defaultRoute} = this.props;
        // 如果是默认路由，且只匹配到父类，则默认跳转
        if (defaultRoute && match.path === location.pathname) {
            history.push(match.path + path);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            let show = CacheRoute.calculateIsMatch(nextProps);
            let routeParams = {};
            if (show) {
                routeParams = CacheRoute.calculateRouteParams(nextProps);
            }
            this.setState({
                show: show,
                routeParams: routeParams
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
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
                    match={this.props.match}
                    routeParams={this.state.routeParams}
                />
            </div>
        );
    }
}
