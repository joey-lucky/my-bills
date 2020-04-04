import * as React from "react";
import {Layout, Table} from "antd";
import store from "./store";


export default class User extends React.Component {
    columns = [

    ];

    componentDidMount() {
        store.loadData().then();
    }

    render() {
        return (
            <Layout>


            </Layout>
        );
    }
}