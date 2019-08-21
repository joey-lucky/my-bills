

export class RouteUtils {

    static getQueryObject(location){
        let result = {};
        let searchText = location.search;
        if (searchText) {
            searchText = searchText.replace(/^[\?]/, "");
            let splits = searchText.split("&");
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
        }
        return result;

    }



}