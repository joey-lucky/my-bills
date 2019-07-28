import * as React from "react";
import {Flex, Picker} from "antd-mobile";
import Text from "@components/Text";
import FormItem from "./FormItem";
import icons from "@res/icons";
import FontIcon from "@components/FontIcon";
import colors from "@res/colors";
import fontSizes from "@res/fontSizes";
import RemoteDataPicker from "@components/RemoteDataPicker";

// function findIndexListWithValues(rows = [], values = []) {
//     let length = values.length;
//     let indexList = [];
//     let currRows = rows;
//     for (let i = 0; i < length; i++) {
//         let value = values[i];
//         let indexOf = currRows.findIndex(item => item.value === value);
//         let item = currRows[indexOf] || {};
//         currRows = item.children || [];
//         indexList[i] = indexOf;
//     }
//     return indexList;
// }
//
// function findIndexListWithValue(rows = [], value, fatherIndex = []) {
//     for (let i = 0; i < rows.length; i++) {
//         let item = rows[i];
//         if (item.children && item.children.length > 0) {
//             let itemFatherIndex = [...fatherIndex, i];
//             let findResult = findIndexListWithValue(item.children, value, itemFatherIndex);
//             if (findResult.length > itemFatherIndex.length) {
//                 return findResult;
//             }
//         } else {
//             if (item.value === value) {
//                 return [...fatherIndex, i];
//             }
//         }
//     }
//     return fatherIndex;
// }
//
// function getLabel(rows = [], indexList = []) {
//     let length = indexList.length;
//     let currRows = rows;
//     let label = [];
//     for (let i = 0; i < length; i++) {
//         let index = indexList[i];
//         let item = currRows[index] || {};
//         label.push(item.label || "");
//         currRows = item.children || [];
//     }
//     return label;
// }
//
// function getValues(rows = [], indexList = []) {
//     let length = indexList.length;
//     let currRows = rows;
//     let values = [];
//     for (let i = 0; i < length; i++) {
//         let index = indexList[i];
//         let item = currRows[index] || {};
//         values.push(item.value);
//         currRows = item.children || [];
//     }
//     return values;
// }

// export default class PickerItem extends React.Component {
//     static propTypes = {
//         label: PropTypes.string.isRequired,
//         cols: PropTypes.number,
//         onChange: PropTypes.any,
//         value: PropTypes.any,
//         url: PropTypes.any,
//         parse: PropTypes.shape({
//             id: PropTypes.string,
//             name: PropTypes.string,
//             children: PropTypes.any,
//         }),
//         params: PropTypes.any,
//         data: PropTypes.any,
//     };
//
//     static isEqual(props, nextProps, key) {
//         let propsValue = props[key] || "";
//         let nextPropsValue = nextProps[key] || "";
//         return JSON.stringify(propsValue) === JSON.stringify(nextPropsValue);
//     }
//
//     static getDerivedStateFromProps(nextProps, prevState) {
//         if ("value" in nextProps) {//value存在。
//             let nextValue = nextProps.value;
//             let {data, lastValue} = prevState;
//             if (lastValue !== nextValue) {
//                 let index = findIndexListWithValue(data, nextValue);
//                 let values = getValues(data, index);
//                 return {
//                     selectIndex: index,
//                     lastValue: nextValue,
//                     values: values,
//                 };
//             }
//         }
//         return null;
//     }
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: [],
//             selectIndex: [],
//             values: [],
//             lastValue: props.value || props.defaultValue,
//             visible: false,
//         };
//     }
//
//     componentDidMount() {
//         this.asyncLoadData(this.props).then((data = []) => {
//             let {lastValue} = this.state;
//             let index = findIndexListWithValue(data, lastValue);
//             let values = getValues(data, index);
//             this.setState({
//                 data: data,
//                 selectIndex: index,
//                 values: values,
//             });
//         });
//     }
//
//     asyncLoadData = (props) => {
//         const {url, parse, params, data} = props;
//         if (data) {
//             return Promise.resolve(data);
//         }
//         return request(url, params)
//             .then((d) => {
//                 let data = d.data || [];
//                 return this.parseData(data, parse);
//             });
//     };
//
//     parseData(rows, parse) {
//         const {id = "id", name = "name"} = parse;
//         return rows.map((item) => {
//             let bean = {
//                 value: item[id],
//                 label: item[name],
//             };
//             if (item.children) {
//                 bean.children = this.parseData(item.children, parse.children);
//             }
//             return bean;
//         });
//     }
//
//     onPickerChange = (values) => {
//         let {data = []} = this.state;
//         let value = [...values].pop();
//         let index = findIndexListWithValues(data, values);
//         this.setState({
//             selectIndex: index,
//             values: values,
//             lastValue: value,
//         });
//         this.props.onChange && this.props.onChange(value);
//     };
//
//     onClick = (e) => {
//         e.stopPropagation();
//         this.setState({
//             visible: true
//         });
//     };
//
//     onVisibleChange = (visible) => {
//         if (this.state.visible !== visible) {
//             this.setState({visible: visible})
//         }
//     };
//
//     render() {
//         const {data, selectIndex, values} = this.state;
//         const {cols = 1} = this.props;
//         let label = getLabel(data, selectIndex) || [];
//         return (
//             <React.Fragment>
//                 <Picker
//                     visible={this.state.visible}
//                     title={"请选择"}
//                     data={data}
//                     cols={cols}
//                     value={values}
//                     onVisibleChange={this.onVisibleChange}
//                     onChange={this.onPickerChange}
//                 />
//                 <FormItem
//                     style={{width: "100%", height: "100%"}}
//                     align={"center"}
//                     label={this.props.label}
//                     icon={icons.xe321}
//                     color={"#8880EF"}
//                     onClick={this.onClick}
//                 >
//                     <Flex
//                         style={{width: "100%", height: "100%"}}
//                         direction={"row"}
//                         align={"center"}
//                     >
//                         {
//                             label.map((item, index, array) =>
//                                 <React.Fragment key={item + index}>
//                                     <Text type={"title"} text={item}/>
//                                     {
//                                         index !== array.length - 1 &&
//                                         <FontIcon
//                                             style={{
//                                                 fontSize: fontSizes.title,
//                                                 color: colors.divider,
//                                                 padding: "0 0.2rem"
//                                             }}
//                                             unicode={icons.right}
//                                         />
//                                     }
//                                 </React.Fragment>
//                             )
//                         }
//                     </Flex>
//                 </FormItem>
//             </React.Fragment>
//
//
//         );
//     }
//
//     componentDidUpdate(prevProps, prevState, snapshot) {
//         let requestChange = !PickerItem.isEqual(this.props, prevProps, "url") ||
//             !PickerItem.isEqual(this.props, prevProps, "parse") ||
//             !PickerItem.isEqual(this.props, prevProps, "params");
//         let dataChange = !PickerItem.isEqual(this.props, prevProps, "data");
//         if (dataChange || requestChange) {
//             this.asyncLoadData(this.props).then((data = []) => {
//                 let {lastValue} = this.state;
//                 let index = findIndexListWithValue(data, lastValue);
//                 let values = getValues(data, index);
//                 this.setState({
//                     data: data,
//                     selectIndex: index,
//                     values: values,
//                 });
//             });
//         }
//     }
// }

export default function PickerItem(props) {
    const {label,...pickerProps} = props;
    return (
        <FormItem
            style={{width: "100%", height: "100%"}}
            align={"center"}
            label={label  }
            icon={icons.xe321}
            color={"#8880EF"}
        >
           <RemoteDataPicker
               {...pickerProps}
           />
        </FormItem>
    );

}