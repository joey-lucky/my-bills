import * as React from "react";
import {observable, toJS} from "mobx";
import {addBillApi} from "../../../services/api";
import {Flex} from "antd-mobile";
import TemplateHeader from "./TemplateHeader";
import TemplateItem from "./TemplateItem";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";

class AppState {
    @observable data = [];

    asyncLoadData() {
        addBillApi.getBillTemplateList().then(d => {
            let data = d.data || [];
            let currType = null;
            data.forEach((item) => {
                if (item.billTypeType !== currType) {
                    item.isFirst = true;
                    currType = item.billTypeType;
                }
            });
            this.data = data;
        });
    }
}

@observer
export default class TemplateList extends React.Component {
    static propTypes = {
        onItemClick: PropTypes.func.isRequired,
    };
    _appState = new AppState();

    componentDidMount(){
        this._appState.asyncLoadData();
    }

    render() {
        let data = toJS(this._appState.data);
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                {
                    data.map((item,index) =>
                        <React.Fragment key={item.id}>
                            {
                                item.isFirst&&
                                <TemplateHeader name={item.billTypeTypeName}/>
                            }
                            <TemplateItem
                                data={item}
                                onClick={(event)=>{
                                    event.stopPropagation();
                                    this.props.onItemClick(item, index);
                                }}
                            />
                        </React.Fragment>
                    )
                }
            </Flex>

        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
};