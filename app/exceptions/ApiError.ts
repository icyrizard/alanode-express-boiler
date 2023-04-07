export class ApiError extends Error {
    public errors: any;
    public code: number;

    constructor(message, code = 409, errors = null) {
        super('Api Error');

        this.name = "ApiError";

        this.code = code;
        this.errors = errors;
        this.message = message;
    }
}