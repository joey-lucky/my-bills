const sql = "select * from bill t where t.xx = @xx and t.yy = @yy";

let params = {xx:12, yy: 13};
let resultParams = [];
let s = sql.replace(/@[a-zA-Z0-9]+/g, (text="") => {
    let key = text.substr(1);
    resultParams.push(params[key] || "");
    return "?"
});

const column = "target_1_Card_user_id";
const ignore = ["create_time", "update_time", "create_by", "update_by"];
console.log(ignore.map(item => "'" + item + "'").join(","));
