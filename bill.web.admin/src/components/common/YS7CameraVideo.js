import * as React from "react";
import * as PropTypes from "prop-types";
import UUID from "@utils/UUID";
import {observer} from "mobx-react";
import PropsUtils from "@utils/PropsUtils";

@observer
export default class YS7CameraVideo extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        // autoPlay: PropTypes.bool,
        // controls: PropTypes.bool,
        // controlsList: PropTypes.string,
        // crossOrigin: PropTypes.string,
        // loop: PropTypes.bool,
        // mediaGroup: PropTypes.string,
        // muted: PropTypes.bool,
        // playsinline: PropTypes.bool,
        // poster: PropTypes.any,
        // preload: PropTypes.string
    };

    _id = UUID.randomUUID(8);
    _player;

    componentDidMount() {
        this.initVideo(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!PropsUtils.isEqual(this.props, nextProps, "src")) {
            this.stopPlay();
            // this._id = UUID.randomUUID(8);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !PropsUtils.isEqual(nextProps, this.props, "src");
    }

    componentDidUpdate(prevProps, prevState) {
        this.initVideo(this.props);
    }

    componentWillUnmount() {
        this.stopPlay();
    }

    stopPlay() {
        if (this._player) {
            this._player.stop();
        }
    }

    initVideo(props) {
        let {src} = props;
        if (!global.EZUIPlayer) {
            alert("萤石云js库加载失败!");
            return;
        }
        if (src) {
            this._player = new global.EZUIPlayer(this._id);
            this._player.on("log", (str) => {
                console.log(str);
            });
        }
    }

    render() {
        return (
            <video
                {...this.props}
                id={this._id}
                autoPlay={true}
                controls={true}
                playsInline={true}
            />
        );
    }
}
