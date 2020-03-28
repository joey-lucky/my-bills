import * as React from "react";
import {Layout, Table} from "antd";
import store from "./store";


export default class User extends React.Component {
    componentDidMount() {
        store.loadData();
    }

    render() {
        return (
            <Layout>


            </Layout>
        );
    }
}