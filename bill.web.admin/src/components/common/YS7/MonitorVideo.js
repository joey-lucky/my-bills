import * as React from "react";
import * as PropTypes from "prop-types";
import UUID from "@utils/UUID";
import {observer} from "mobx-react";
import PropsUtils from "@utils/PropsUtils";
import moment from "moment";

@observer
export default class MonitorVideo extends React.Component {
    static propTypes = {
        src: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        dvrSerialNo: PropTypes.string,
        channelId: PropTypes.string,
        decoderPath: PropTypes.string,
        accessToken: PropTypes.string,
        startTime: PropTypes.objectOf(Date),
        endTime: PropTypes.objectOf(Date),
    };

    _ref = null;
    _id = UUID.randomUUID(8);
    _player;

    componentDidMount() {
        this.initVideo(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (
            !PropsUtils.isEqual(this.props, nextProps, "decoderPath") ||
            !PropsUtils.isEqual(this.props, nextProps, "accessToken") ||
            !PropsUtils.isEqual(this.props, nextProps, "dvrSerialNo") ||
            !PropsUtils.isEqual(this.props, nextProps, "channelId") ||
            !PropsUtils.isEqual(this.props, nextProps, "startTime") ||
            !PropsUtils.isEqual(this.props, nextProps, "endTime")
        ) {
            this.stopPlay().then(() => {
                this.initVideo(this.props);
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let divProps = this.getDivProps(this.props);
        let nextDivProps = this.getDivProps(nextProps);
        return JSON.stringify(divProps) !== JSON.stringify(nextDivProps);
    }

    componentWillUnmount() {
        this.stopPlay().then();
    }

    stopPlay() {
        return new Promise((resolve, reject) => {
            if (this._player) {
                try {
                    this._player.on("log", (str) => {
                        if (str.indexOf("停止播放成功") !== -1 ||str.indexOf("停止播放失败") !== -1 ) {
                            resolve();
                        }
                    });
                    this._player.stop();
                } catch (e) {
                    reject(e);
                }
            } else {
                resolve();
            }
        });

    }

    initVideo(props) {
        let {dvrSerialNo, channelId, accessToken, startTime, endTime, decoderPath = ""} = props;
        if (!global.EZUIPlayer) {
            alert("萤石云js库加载失败!");
            return;
        }
        if (dvrSerialNo && channelId && accessToken) {
            let url = `ezopen://open.ys7.com/${dvrSerialNo}/${channelId}.rec`;
            let params = "";
            if (startTime) {
                params += "&begin=" + moment(startTime).format("YYYYMMDDHHmmss")
            }
            if (endTime) {
                params += "&end=" + moment(endTime).format("YYYYMMDDHHmmss")
            }
            if (params) {
                params = params.replace("&", "?");
            }
            url += params;
            this._player = new global.EZUIKit.EZUIPlayer({
                id: this._id,
                url: url,
                autoplay: true,
                accessToken: accessToken,
                decoderPath: decoderPath,
                width: this._ref.offsetWidth,
                height: this._ref.offsetHeight,
            });
            this._player.on("log", (str) => {
                if (/^播放失败/.test(str)) {
                    alert("播放失败 "+this.getErrorMsg(str));
                }
            });
        }
    }

    getErrorMsg(errorStr){
        try{
            let indexOf = errorStr.indexOf("{");
            let errorObj = JSON.parse(errorStr.substr(indexOf));
            return errorObj.oError.errorMsg;
        }catch (e) {
            return "";
        }
    }

    getDivProps(props) {
        let newProps = {...props};
        delete newProps.dvrSerialNo;
        delete newProps.channelId;
        delete newProps.accessToken;
        delete newProps.startTime;
        delete newProps.endTime;
        return newProps;
    }

    render() {
        return (
            <div
                {...this.getDivProps(this.props)}
                id={this._id}
                ref={ref => {
                    this._ref = ref;
                }}
            />
        );
    }
}
