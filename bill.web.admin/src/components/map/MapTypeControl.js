import BaseMapComponent from "./BaseMapComponent";
import BMap from "./BMap";

export default class MapTypeControl extends BaseMapComponent {
    constructor(props, context) {
        super(props, context, {
            events: [],
            propKeys: ["type", "mapTypes"]
        });
    }

    componentDidMount() {
        let {
            type = global.BMAP_MAPTYPE_CONTROL_HORIZONTAL,
            mapTypes = [global.BMAP_NORMAL_MAP]
        } = this.props;
        let control = new BMap.MapTypeControl({type, mapTypes});
        this.setMapComponent(control);
        this.props.map.addControl(control);
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
        let visible = nextProps.visible || true;
        if (visible !== this.getMapComponent().isVisible()) {
            if (visible) {
                this.getMapComponent().show();
            } else {
                this.getMapComponent().hidden();
            }
        }
    }

    componentWillUnmount() {
        this.props.map.removeControl(this.getMapComponent());
    }
}
