let data = [];
for (let i = 0; i < 50; i++) {
    data.push({
        CODE: 1000000 + i+"",
        VALUE: "名称" + (i + 1),
    });
}

export default class Ajax {
    static apiPost(url, params) {
        return new Promise((resolve) => {
            let d = {};
            if (url.indexOf("list") !== -1) {
                d = {data: this.list(params)};
            } else if (url.indexOf("create") !== -1) {
                data.splice(0, 0, {CODE: params.CODE, VALUE: params.VALUE,});
            } else if (url.indexOf("delete") !== -1) {
                let {CODE: code = ""} = params;
                let index = data.findIndex((item, index) => {
                    return item["CODE"] === code;
                });
                data.splice(index, 1);
            }
            setTimeout(() => {
                resolve(d);
            }, 200);
        });
    }

    static list(params = {CODE: "", VALUE: ""}) {
        let {CODE: code, VALUE: value} = params;
        console.log("xx");
        return data.filter((item = {CODE: "", VALUE: ""}) => {
            if (code && item["CODE"].indexOf(code) === -1) {
                return false;
            }
            if (value && item["VALUE"].indexOf(value) === -1) {
                return false;
            }
            return true;
        })


    }
}
