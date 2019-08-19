import * as React from "react";
import {__RouterContext as RouterContext} from "react-router-dom";

function getQueryObject(location) {
    let searchText = location.search || "";
    searchText = searchText.replace(/^[\?]/, "");
    let splits = searchText.split("&");
    let result = {};
    splits.forEach(item => {
        let entry = item.split("=");
        let key = entry[0];
        let value = decodeURI(entry[1]);
        try {
            let isJSON = /(^[\[][\s\S]*[\]]$)|(^[\{][\s\S]*[\}]$)/;
            if (isJSON.test(value)) {
                value = JSON.parse(value);
            }
        } catch (e) {
        }
        result[key] = value;
    });
    return result;
}

function matchPath(pathname, {path=""}) {
    let realName = path.replace("/", "");
    let pathList = pathname.replace("/", "").split("/");
    let currMathPath = pathname || "";
    for (let i = pathList.length - 1; i >= 0; i--) {
        let item = pathList[i];
        if (item === realName) {
            return {
                path: currMathPath,
                url: pathname,
                index: i,
            }
        }
        currMathPath = currMathPath.substr(0, currMathPath.length - (item.length + 1));
    }
    return null;
}

export default class Switch extends React.Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const location = this.props.location || context.location;
                    let elements = [];
                    React.Children.forEach(this.props.children, child => {
                        const path = child.props.path || child.props.from;
                        let match = matchPath(location.pathname, {path});
                        if (match) {
                            match.params = getQueryObject(location);
                            let {index} = match;
                            elements.push(
                                <div style={{...styles.container, zIndex: 1 + index}}>
                                    {React.cloneElement(child, {location, computedMatch: match})}
                                </div>
                            )
                        }
                    });
                    return elements;
                }}
            </RouterContext.Consumer>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "white",
        top: 0,
        left: 0,
    }
};