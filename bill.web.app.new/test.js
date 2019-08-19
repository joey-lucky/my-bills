let pathname = "/a/ba/c/d/f";
function getQueryObject(location){
    let searchText = location.search||"";
    searchText = searchText.replace(/^[\?]/, "");
    let splits = searchText.split("&");
    let result = {};
    splits.forEach(item => {
        let entry = item.split("=");
        let key = entry[0];
        let value = decodeURI(entry[1]);
        try {
            let isJSON = /(^[\[][\s\S]*[\]]$)|(^[\{][\s\S]*[\}]$)/;
            if (isJSON.test(value)) {
                value = JSON.parse(value);
            }
        } catch (e) {
        }
        result[key] = value;
    });
    return result;
}
function mathPath(pathname, path) {
    let realName = path.replace("/", "");
    let pathList = path.replace("/", "").split("/");
    for (let i = pathList.length - 1; i >= 0; i--) {
        let item = pathList[i];
        if (item === realName) {
            return {
                path:path,
                url:pathname,
                index:i,
                params:getQueryObject(window.location),
            }
        }
    }
}


console.log(mathPath(pathname, "/a"));
console.log(mathPath(pathname, "/f"));

console.log(mathPath(pathname, "/b"));
console.log(mathPath(pathname, "/a/"));
