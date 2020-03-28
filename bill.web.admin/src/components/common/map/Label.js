import PropTypes from "prop-types";
import BaseMapComponent from "./BaseMapComponent";
import BMap from "./BMap";

export default class Label extends BaseMapComponent {
    static contextTypes = {
        map: PropTypes.any,
    };

    constructor(props, context) {
        super(props, context, {
            events: ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "rightclick"],
            propKeys: ["content", "title", "enableMassClear", "zIndex"],
            objectKeys: ["position", "offset", "shadow", "label"]
        });
    }

    componentDidMount() {
        this.setMapComponent(new BMap.Label());
        this.changeByAllProps();
        this.bindEventListener();
        this.context.map.addOverlay(this.getMapComponent());
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
    }

    componentWillUnmount() {
        this.context.map.removeOverlay(this.getMapComponent());
    }

    render() {
        return null;
    }
}
