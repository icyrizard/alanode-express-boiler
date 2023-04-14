import { ValidatorObjectType } from "../types/Validators";

export class ValidationError extends Error {
    public errors: ValidatorObjectType;

    constructor(errors: ValidatorObjectType) {
        super('validation error');

        this.name = "ValidationError";
        this.errors = errors;
    }
}