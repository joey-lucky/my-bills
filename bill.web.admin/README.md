# React开发范例
## 常用英文
- get 获取数据，通常有返回值
- delete 删除
- update 更改
- create 增加
- load 加载数据

## 一、代码规范

#### 命名规范
**【强制】：包名全小写**
**【强制】：组件文件名首字母大写的驼峰命名法**
**【强制】：组件类名首字母大写的驼峰命名法，必须和文件同名**
**【强制】：私有变量以下划线开头**
**【强制】：公共变量：驼峰命名法**
**【强制】：方法名采用驼峰命名法,异步必须以async开头**

#### 其它规范

**【强制】：字符串强制使用双引号（带函数字符串除外）**
**【强制】：div或者span带有事件，必须增加role属性，或者用有含义的标签，比如button代替。**
**【强制】：for-in用Object.keys代替**
**【建议】：尽量采用ES6+的代码格式**
- 用let,const代替var
- 用class代替function
- 用三等号代替双等号
- 用箭头函数代替普通函数

**【建议】：尽量使用函数式代替命令式编程**

```
    //命令式：逐行运行
    let arr1 = ["joke","mary"];
    let data = [];
    for (let i = 0; i < arr1.length; i++) {
        let item = arr1[i];
        data.push({name: item});
    }

    //函数式
    let arr1 = ["joke","mary"];
    let data = arr1.map((item) => ({name: item}));
```


## 二、组件规范

**【强制】：内部代码顺序**
- 静态方法和静态变量
- 构造函数
- 组件生命周期
- 其它(包括点击事件等方法)
- render

**【强制】：import包排序是相对路径-绝对路径**

```
    import React from "react";
    import {Ajax} from "../common/unit/ajax";
```

**【强制】：组件包含propTypes**

```
    static propTypes = {
        dictTypeCode: PropTypes.any,
        parentCode: PropTypes.any,
    };
```

**【强制】：非路由指向的业务组件，必须有newState()方法，并返回AppState对象**

```
    static newState() {
        return new AppState();
    }
```

**【建议】：成员变量默认私有变量，全部以下划线开头**

```
    _columns = [];
    _appState = new AppState();
```
> 通常情况下，我们不会直接操作组件对象，所以公开的成员变量没有意义。

**【强制】：构造函数中，存放初始化的操作**

```
    constructor(props,context){
        super(props,context);
        this._count = 10;//初始化count
    }
```

**【强制】：componentDidMount存放网络数据的加载等有副作用的操作**

```
    componentDidMount() {
        this._appState.asyncLoadData();
    }
```


**【强制】：事件以on开头，并且使用箭头函数定义**

```
    onAddClick = () => {
        this._appState.showAddDialog();
    };

    onAddSuccess = () => {
        this._appState.asyncLoadData();
    };
```

**【强制】：不直接修改AppState内部的变量**

```
    //bad
    onEditClick = (record) => {
        this._appState.addState.data = record;
        this._appState.addState.visible = true;
    };

    //good
    onEditClick = (record) => {
        this._appState.showEditDialog(record);
    };
```

**【强制】：render方法不要出现for循环等耗时操作**
**【强制】：使用声明式编程来写html**

```
    //命令式 bad
    render() {
        const {markers} = this._appState;
        const markersDOM = [];
        for(let i=0;i<markers.length;i++){
            let item = markers[i];
            markersDOM.push( <Marker data={item} /> );
        }
        return (
            <Layout style={{height: "100%"}}>
                {markersDOM}
            </Layout>
        );
    }

    //声明式 good
    render() {
        const {markers} = this._appState;
        return (
            <Layout style={{height: "100%"}}>
                {markers.map((item)=><Marker data={item} />)}
            </Layout>
        );
    }
```




## 三、组件状态（AppState）

**【强制】：类名固定为AppState**
**【强制】：observable只装饰需要监听变化的数据，切勿装饰AppState**

```
    //good
    @observable markers = []

    //bad
    @observable editState = FormEditDialog.newState();

```
**【建议】：数据最好有初始化值**
**【建议】：加载异步数据前，先清空数据**

```
    asyncLoadData() {
        this.data = [];//清空数据
        Ajax.apiPost("/xxx/xxx/list", {ID: "xxxx"})
            .then((d) => {
                this.data = d.data || [];
            });
    }
```


## 其它规范
**【建议】：不要用字符串的形式拼接html,接使用react-dom来转换成html字符串**

