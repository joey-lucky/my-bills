const headers = new Headers();
headers.append("Content-Type", "application/json;charset=utf-8");
// headers.append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
// headers.append("Content-Length", content.length.toString());
// headers.append("X-Custom-Header", "ProcessThisImmediately");

export default class Ajax {
    static async httpGet(url, params) {
        try {
            let completeUrl = "/api" + url;
            let response = await fetch(completeUrl, {
                method: 'GET',
                headers: headers,
                // mode: 'cors',
                // cache: 'default',
                body: JSON.stringify(params)
            });
            let data = await response.json();
            if (data.code === "1") {
                return data;
            } else {
                let message = data.message;
                return new Error(message);
            }
        } catch (e) {
            return e;
        }
    }

    static async apiPost(url, params) {
        try {
            let completeUrl = "/api" + url;
            let response = await fetch(completeUrl, {
                method: 'POST',
                headers: headers,
                // mode: 'cors',
                // cache: 'default',
                body: JSON.stringify(params)
            });
            let data = await response.json();
            if (data.code === "1") {
                return data;
            } else {
                let message = data.message;
                return new Error(message);
            }
        } catch (e) {
            return e;
        }
    }
}
