let QUERY_PARAMS = Symbol("Request:queryParams");
let QUERY_OBJECTS = Symbol("Request:queryObjects");

export interface ExtendRequest {
    queryParams: { [key: string]: string };
    queryObjects: { [key: string]: any };
}

let extend: ExtendRequest = {
    get queryParams(): { [key: string]: string } {
        let parameterName = QUERY_PARAMS;
        if (!this[parameterName]) {
            let request:any = this;
            if (request.method === "GET") {
                this[parameterName] = request.query;
            } else {
                this[parameterName] = request.body;
            }
        }
        return this[parameterName];
    },

    get queryObjects(): { [key: string]: object } {
        let parameterName = QUERY_OBJECTS;
        if (!this[parameterName]) {
            let params = this.queryParams;
            let objects = {};
            Object.keys(params).forEach((key) => {
                let value = params[key];
                if (value) {
                    try{
                        let obj = JSON.parse(value);
                        if (typeof obj !== "string") {
                            objects[key] = obj;
                        } else {
                            objects[key] = value;
                        }
                    }catch (e) {
                        objects[key] = value;
                    }
                } else {
                    objects[key] = undefined;
                }
            });
            this[parameterName] = objects;
        }
        return this[parameterName];
    },
};

export default extend;