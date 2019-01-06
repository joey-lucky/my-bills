import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import * as styles from "./PreviewPhotoDialog.css";

class AppState {
    @observable visible = false;
    @observable url = "";
}

@observer
export default class PreviewPhotoDialog extends React.Component {
    onPhotoClick = () => {
        let {state} = this.props;
        state.visible = false;
    };

    render() {
        const {visible = false, url = ""} = this.props.state;
        if (visible) {
            return (
                <div
                    className={styles.container}
                    onClick={this.onPhotoClick}
                >
                    <img
                        className={styles.img}
                        src={url}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
}

export const previewPhotoState = new AppState();

