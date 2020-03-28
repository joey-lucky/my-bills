import PropTypes from "prop-types";
import BaseMapComponent from "./BaseMapComponent";
import BMap from "./BMap";

export default class Polyline extends BaseMapComponent {
    static contextTypes = {
        map: PropTypes.any,
    };

    constructor(props, context) {
        super(props, context, {
            events: ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "lineupdate", "PolylineOptions"],
            propKeys: ["strokeColor", "strokeOpacity", "strokeWeight", "strokeStyle", "bounds", "enableEditing", "enableMassClear", "positionAt"],
            objectKeys: ["path", "icons"]
        });
    }

    componentDidMount() {
        this.setMapComponent(new BMap.Polyline());
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
