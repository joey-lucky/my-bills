const USER = Symbol("Request:user");

export interface ExtendContext{
    getUserInfo(): Promise<any>;
}

let extend: ExtendContext = {
    async getUserInfo(): Promise<any> {
        if (!this[USER]) {
            let ctx: any = this;
            let token = ctx.request.queryParams["_token"];
            let {app: {sqlExecutor, tokenCrypto},} = ctx;
            if (token) {
                let tokenObj = tokenCrypto.parseToken(token);
                this[USER] = await sqlExecutor.get("bc_user", {id: tokenObj.userId});
            } else {
                this[USER] = {};
            }
        }
        return this[USER];
    }
};



export default extend;