import * as React from "react";
import * as styles from "./index.css";
import BottomIcon from "@pages/Home/BottomBar/BottomIcon";
import * as PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

@withRouter
export default class BottomBar extends React.Component {
    static propTypes = {
        onItemClick: PropTypes.func,
        data: PropTypes.array.isRequired,
    };
    onAddBillClick = () => {
        this.props.history.push(this.props.match.path + "/add-bill");
    };

    render() {
        return (
            <div className={styles.container}>
                {
                    this.props.data.map((item, index, array) =>
                        <React.Fragment key={item.label}>
                            <BottomIcon
                                title={item.label}
                                unicode={item.icon}
                                onClick={() => {
                                    this.props.history.push(this.props.match.path + "/" + item.url);
                                }}
                            />
                            {
                                index === 1 &&
                                <div
                                    onClick={this.onAddBillClick}
                                    className={styles.center}>记一笔</div>
                            }
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}