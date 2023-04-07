export class ValidationError extends Error {
    public errors: any;

    constructor(errors) {
        super('validation error');
        this.name = "ValidationError";
        this.errors = errors;
    }
}