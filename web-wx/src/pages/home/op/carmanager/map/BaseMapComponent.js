import * as React from "react";
import PropTypes from "prop-types";

export default class BaseMapComponent extends React.Component {
    static propTypes = {
        eventListener: PropTypes.object
    };

    static changeComponent(component, propName, value) {
        if (value === undefined) {
            return;
        }
        let mapComponent = component.getMapComponent();
        if (/^[enable][a-z0-1A-Z]*$/.test(propName)) {
            // 布尔型的变量
            let methodName;
            if (value) {
                methodName = propName;
            } else {
                methodName = "disable" + propName.substr(6);
            }
            mapComponent[methodName] && mapComponent[methodName]();
        } else {
            // 其它变量
            let firstLetter = propName.substr(0, 1).toUpperCase();
            let methodName = "set" + firstLetter + propName.substr(1);
            mapComponent[methodName] && mapComponent[methodName](value);
        }
    }


    _events = [];
    _propKeys = [];
    _mapComponent;

    constructor(props, context, {events = [], propKeys = []}) {
        super(props, context);
        this._events = events;
        this._propKeys = propKeys;
    }

    getPropKeys() {
        return this._propKeys;
    }

    getEvents() {
        return this._events;
    }

    setMapComponent(component) {
        this._mapComponent = component;
    }

    getMapComponent() {
        return this._mapComponent;
    }

    changeByDiffProps(nextProps) {
        this.getPropKeys().forEach((propName) => {
            let value = this.props[propName];
            let nextValue = nextProps[propName];
            if (JSON.stringify(value) !== JSON.stringify(nextValue)) {
                BaseMapComponent.changeComponent(this, propName, nextValue);
            }
        });
    }

    changeByAllProps() {
        this.getPropKeys().forEach((propName) => {
            BaseMapComponent.changeComponent(this, propName, this.props[propName]);
        });
    }

    bindEventListener() {
        this.getEvents().forEach((eventName) => {
            this.getMapComponent().addEventListener(eventName, (event) => {
                const {eventListener = {}} = this.props;
                eventListener[eventName] && eventListener[eventName](event);
            });
        });
    }

    render() {
        return null;
    }
}
