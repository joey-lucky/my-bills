export default class RouteUtils {
    static parseQueryParams(location = {}) {
        let searchText = location.search || "";
        let params = {};
        if (searchText) {
            searchText = decodeURI(searchText);
            searchText = searchText.replace(/^\?/, "");
            let entryList = searchText.split("&");
            entryList.forEach((item) => {
                let entry = item.split("=");
                let key = entry[0];
                let value = entry[1];
                if (/(^{[\S\s]*}$)|(^\[[\S\s]*\]$)/.test(value)) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        console.error(e);
                    }
                }
                params[key] = value;
            });
        }
        return params;
    }

    static getQueryObject(location){
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

}
