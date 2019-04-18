import React from "react";
export default class DomUtils {
    static toHtmlString(reactNode) {
        let {type} = reactNode;
        let {children, ...props} = reactNode.props;
        let propsStr = "";
        Object.keys(props).forEach((propName) => {
            let propValue = props[propName] || "";
            if (propName === "className") {
                propsStr += ` class="${JSON.stringify(propValue)}"`;
            } else {
                if (typeof propValue === "string") {
                    propsStr += ` ${propName}="${propValue}"`;
                } else {
                    propsStr += ` ${propName}="${JSON.stringify(propValue)}"`;
                }
            }
        });
        if (typeof children === "string") {
            return `<${type}${propsStr}>${children}</${type}>`;
        } else if (Array.isArray(children)) {
            let childStr = "";
            React.Children.forEach(children, (child, index) => {
                childStr += this.toHtmlString(child);
            });
            return `<${type}${propsStr}>${childStr}</${type}>`;
        } else {
            let childStr = this.toHtmlString(children);
            return `<${type}${propsStr}>${childStr}</${type}>`;
        }
    }
}

