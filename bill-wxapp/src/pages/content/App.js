import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Redirect, Route, Switch} from "react-router";
import AppBarContent from "./AppBarContent";

@observer
export default class App extends React.Component {
    @observable _tabBarState = {
        hidden: false,
        selectedTab: "data"
    };


    onTabBarClick = (tab) => {
        if (this._tabBarState.selectedTab !== tab) {
            this._tabBarState.selectedTab = tab;
        }
    };

    renderTabBarIcon(url) {
        return (
            <div style={{
                width: '22px',
                height: '22px',
                background: `'url(${url}) center center /  21px 21px no-repeat`
            }}/>
        );
    }

    render() {
        return (
            <Switch>
                <Route
                    path={"/app-bar"}
                    component={AppBarContent}/>
                <Route
                    path={"/nav-bar"}
                    component={AppBarContent}/>
                <Redirect to={"/app-bar"}/>
            </Switch>
        );
    }


}
//
// export default class App extends Component {
//     componentDidMount() {
//
//     }
//
//     render() {
//         const {match} = this.props;
//         return (
//             <Flex
//                 className={"fill-parent"}
//                 direction={"column"}
//             >
//                 <Flex.Item style={{width: "100%"}}>
//                     <Switch>
//                         {
//                             routes.map((item) =>
//                                 <Route
//                                     key={match.path + item.path}
//                                     path={match.path + item.path}
//                                     component={(props) => {
//                                         let Comp = item.component;
//                                         return (
//                                             <Comp
//                                                 {...props}
//                                                 childRouteData={item.children}
//                                             />
//                                         );
//                                     }}/>
//                             )
//                         }
//                         <Redirect to={match.path + routes[0].path}/>
//                     </Switch>
//                 </Flex.Item>
//                 <TabBar/>
//             </Flex>
//         )
//     }
// }
