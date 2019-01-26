import * as React from "react";

export default class LogUtils {
    static logLifeCycle = function (WrappedComponent) {
        return class extends React.Component {
            static newState() {
                return WrappedComponent.newState();
            }

            componentWillMount() {
                console.log(WrappedComponent.name, "componentWillMount");
            }

            componentDidMount() {
                console.log(WrappedComponent.name, "componentDidMount");
            }

            componentWillUnmount() {
                console.log(WrappedComponent.name, "componentWillUnmount");
            }

            render() {
                return <WrappedComponent {...this.props}/>;
            }
        };
    };
}
