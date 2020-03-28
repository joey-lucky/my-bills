import {Divider} from "antd";
import {observer} from "mobx-react";
import * as React from "react";
import * as PropTypes from "prop-types";
import * as styles from "./index.module.css";
import NavItem from "./NavItem";

@observer
export default class Header extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        userName: PropTypes.string.isRequired,
        onLoginOutClick: PropTypes.func,
        onChangPassWordClick: PropTypes.func,
    };

    render() {
        let {data = [], userName, title, version, onLoginOutClick, onChangPassWordClick} = this.props;
        return (
            <div className={styles.header}>
                <div className={styles.icon}>{title}</div>
                <div className={styles.tabContainer}>
                    {
                        data.map(item => <NavItem key={item.path} name={item.name} path={item.path}/>)
                    }
                </div>
                <ul className={styles.tool}>
                    <li className={styles.versions}>版本号：{version}</li>
                    <li className={styles.exit}>
                        <span>{userName}</span><Divider style={{margin: "0 6px"}} type="vertical"/>
                        <a
                            href="javascript:void(0)"
                            style={{color: "white"}}
                            onClick={onChangPassWordClick}
                        >修改密码</a>
                        <Divider style={{margin: "0 6px"}} type="vertical"/>
                        <a
                            href="javascript:void(0)"
                            style={{color: "white"}}
                            onClick={onLoginOutClick}
                        >退出</a>
                    </li>
                </ul>
            </div>
        );
    }
}
