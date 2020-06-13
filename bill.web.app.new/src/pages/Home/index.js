import * as React from "react";
import ToolBar from "./ToolBar";
import Total from "./Total";
import Content from "./Content";
import BottomBar from "./BottomBar";
import {Flex} from "antd-mobile";
import icons from "@res/icons";
import {observable} from "mobx";
import {observer} from "mobx-react";
import ContentItem from "@pages/Home/Content/ContentItem";
import moment from "moment";
import {homeAPI} from "../../services";

class AppState {
    @observable data = [];

    asyncLoadData() {
        homeAPI.getCurrTotal().then((d) => {
            let data = d.data && d.data[0] || {};
            let {today = {}, toWeek = {}, toMonth = {}, preMonth = {}} = data;
            let list = [];
            list.push({...today, "title": "当天"});
            list.push({...toWeek, "title": "本周"});
            list.push({...toMonth, "title": "本月"});
            list.push({...preMonth, "title": "上月"});
            this.data = list;
        });
    }
}


@observer
export default class Home extends React.Component {
    _appState = new AppState();
    _bottomIcons = [
        {
            label: "账户",
            url: "asset",
            icon: icons.xe301
        },
        {
            label: "流水",
            url: "list",
            icon: icons.xe302
        },
        {
            label: "统计",
            url: "invest",
            icon: icons.xe303
        },
        {
            label: "设置",
            url: "setting",
            icon: icons.xe304
        },
    ];

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onItemClick = (item) => (e) => {
        e.stopPropagation();
        let params = `?dateTime=['${item.startDate}','${item.endDate}']`;
        this.props.history.push(this.props.match.path + "/sub-list" + params);
    };

    render() {
        return (
            <Flex
                style={{width: "100%", height: "100%"}}
                direction={"column"}
            >
                <ToolBar title={"默认账本"}/>
                <Flex direction={"column"} style={{width: "100%", height: 0, flex: 1, overflowY: "auto"}}>
                    <Total/>
                    {
                        this._appState.data.map(item=>
                            <ContentItem
                                title={item.title}
                                outgoing={item.outgoing||"0.00"}
                                income={item.income||"0.00"}
                                dateText={moment(item.startDate).format("MM月DD日 - ")+moment(item.endDate).format("MM月DD日")}
                                onClick={this.onItemClick(item)}
                            />
                        )
                    }
                </Flex>
                <BottomBar data={this._bottomIcons}/>
            </Flex>
        );

    }
}