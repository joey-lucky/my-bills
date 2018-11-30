const headers = new Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
// headers.append("Content-Length", content.length.toString());
headers.append("X-Custom-Header", "ProcessThisImmediately");

export default class HttpUtils {
    static async httpGet(url, params) {
        try{
            let response = await fetch("/api/safe/login", {
                method: 'POST',
                headers: headers,
                // mode: 'cors',
                // cache: 'default',
                body: JSON.stringify(params)
            });
            let data = await response.json();
            if (data.code === "1") {
                return Promise.resolve(data);
            } else {
                let message = data.message;
                console.log(message);
                throw new Error(message);
            }
        }catch (e) {
            return Promise.reject(e)
        }
    }

}
