import { ValidationError } from "./ValidationError";

export class ApiError extends Error {
    public errors: ValidationError[] | null;
    public code: number;

    constructor(message: string, code: number = 409, errors: ValidationError[] = null) {
        super('Api Error');

        this.name = "ApiError";

        this.code = code;
        this.errors = errors;
        this.message = message;
    }
}