import * as React from "react";
import PropTypes from "prop-types";
import PropsUtils from "@utils/PropsUtils";

export default class BaseMapComponent extends React.Component {
    static propTypes = {
        eventListener: PropTypes.object
    };
    static contextTypes = {
        map: PropTypes.any,
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

    static changeObjectComponent(component, propName, value) {
        let mapComponent = component.getMapComponent();
        let firstLetter = propName.substr(0, 1).toUpperCase();
        let methodName = "set" + firstLetter + propName.substr(1);
        if (value) {
            let obj = null;
            if (Array.isArray(value)) {
                obj = value.map(item => (item && item.toBMapObject && item.toBMapObject()) || null);
            } else {
                obj = (value && value.toBMapObject && value.toBMapObject()) || null;
            }
            mapComponent[methodName] && mapComponent[methodName](obj);
        } else {
            mapComponent[methodName] && mapComponent[methodName](value);
        }
    }

    _events = [];
    _propKeys = [];
    _objectKeys = [];
    _mapComponent;

    constructor(props, context, {events = [], propKeys = [], objectKeys = []}) {
        super(props, context);
        this._events = events;
        this._propKeys = propKeys;
        this._objectKeys = objectKeys;
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
        Object.keys(nextProps).forEach((propName) => {
            let nextValue = nextProps[propName];
            if (this._propKeys.indexOf(propName) !== -1) {
                if (!PropsUtils.isEqual(this.props, nextProps, propName)) {
                    BaseMapComponent.changeComponent(this, propName, nextValue);
                }
            } else if (this._objectKeys.indexOf(propName) !== -1) {
                if (!PropsUtils.isEqual(this.props, nextProps, propName)) {
                    BaseMapComponent.changeObjectComponent(this, propName, nextValue);
                }
            }
        });
    }

    changeByAllProps() {
        Object.keys(this.props).forEach((propName) => {
            if (this._propKeys.indexOf(propName) !== -1) {
                BaseMapComponent.changeComponent(this, propName, this.props[propName]);
            } else if (this._objectKeys.indexOf(propName) !== -1) {
                BaseMapComponent.changeObjectComponent(this, propName, this.props[propName]);
            }
        });
    }

    bindEventListener() {
        let events = this.getEvents() || [];
        const {eventListener = {}} = this.props;
        Object.keys(eventListener).forEach((key) => {
            if (events.indexOf(key) !== -1) {
                this.getMapComponent().addEventListener(key, (...arg) => {
                    eventListener[key] && eventListener[key](...arg);
                });
            }
        });
    }

    render() {
        return null;
    }
}
