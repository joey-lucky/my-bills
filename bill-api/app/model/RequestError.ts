export default class RequestError extends Error {
    readonly error:Error;

    constructor(message: string,error:Error) {
        super(message);
        this.error = error;
    }

    public getError():Error{
        return this.error;
    }
}