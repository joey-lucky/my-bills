const QUERY_PARAMS = Symbol("Request:queryParams");
const QUERY_OBJECTS = Symbol("Request:queryObjects");

export interface ExtendRequest {
    queryParams: { [key: string]: string };
    queryObjects: { [key: string]: any };
}

const extend: ExtendRequest = {
    get queryParams(): { [key: string]: string } {
        const parameterName = QUERY_PARAMS;
        if (!this[parameterName]) {
            const request: any = this;
            if (request.method === "GET") {
                this[parameterName] = request.query;
            } else {
                this[parameterName] = request.body;
            }
        }
        return this[parameterName];
    },

    get queryObjects(): { [key: string]: object } {
        const parameterName = QUERY_OBJECTS;
        if (!this[parameterName]) {
            const params = this.queryParams;
            const objects = {};
            Object.keys(params).forEach((key) => {
                const value = params[key];
                if (value) {
                    try{
                        const obj = JSON.parse(value);
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