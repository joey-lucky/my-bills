const USER = Symbol("Request:user");

export interface ExtendContext{
    getUserInfo(): Promise<any>;
}

const extend: ExtendContext = {
    async getUserInfo(): Promise<any> {
        if (!this[USER]) {
            const ctx: any = this;
            const token = ctx.request.queryParams["_token"];
            const {app: {sqlExecutor, tokenCrypto}} = ctx;
            if (token) {
                const tokenObj = tokenCrypto.parseToken(token);
                this[USER] = await sqlExecutor.get("bc_user", {id: tokenObj.userId});
            } else {
                this[USER] = {};
            }
        }
        return this[USER];
    },
};

export default extend;