import { Request, Response } from "express";
import * as validatorLib from './validators';
import { ValidatorObjectType } from "../types/Validators";
import validations from "../messages/en/validations";
import { isEmpty, get, has } from 'lodash';
import { ValidationError } from "../exceptions/ValidationError";

export class Validator {
    private validateValueWithValidator(value, key, validator, validatorKey, params, isNullable, errors) {
        const asserted = validator.apply(this, [value, params, isNullable]);

        if (!asserted) {
            let messageTemplate = validations[validatorKey] ?? validations['default'];
            messageTemplate = messageTemplate.replace(":value", params);

            if (!errors[key]) {
                errors[key] = [messageTemplate]
            } else {
                errors[key].push(messageTemplate);
            }
        }

        return errors;
    }

    private validateEntry(body, key, validators, keyAlias = null) {
        const errors = {};

        const isRequired = !!validators.find((v) => v === 'required');
        const isNullable = !!validators.find((v) => v === 'nullable');

        if (isRequired && !has(body, key)) {
            const messageTemplate = validations['required'] ?? validations['default'];

            if (!errors[key]) {
                errors[key] = [messageTemplate]
            } else {
                errors[key].push(messageTemplate);
            }

            // we're done validating this field, this field is required and not provided.
            return errors;
        }

        validators = validators.filter((v) => v !== 'required');

        for (let i = 0; i < validators.length; i++) {
            const [validatorKey, params] = validators[i].split(':');
            const validator = validatorLib[validatorKey];

            const value = get(body, key) ?? null;

            if (value === null && isNullable) {
                continue;
            }

            this.validateValueWithValidator(value, keyAlias || key, validator, validatorKey, params, isNullable, errors)
        }

        return errors;
    }

    validateList(body, key, validators, deepValidateKeys) {
        let errors = {};

        const topLevelKey = deepValidateKeys.shift();

        // get the list within the body to validate
        const list = get(body, topLevelKey);

        if (!list) {
            return;
        }

        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < deepValidateKeys.length; j++) {
                const deepError = this.validateEntry(list[i], deepValidateKeys[j], validators, `${topLevelKey}.${j}.${deepValidateKeys[i]}`);

                if (!isEmpty(deepError)) {
                    errors = {...errors, ...deepError};
                }
            }
        }

        return errors;
    }

    validate(req: Request, res: Response, validatorObject: ValidatorObjectType, data) {
        let errors = {};

        Object.entries(validatorObject).forEach(([key, validators]) => {
            const deepValidateKeys = key.split('.*.');

            // used for arrays
            if (deepValidateKeys.length > 1) {
                const deepValidationErrors = this.validateList(data, key, validators, deepValidateKeys);

                if (!isEmpty(deepValidationErrors)) {
                    errors = {...errors, ...deepValidationErrors}
                }
            } else {
                const validationError = this.validateEntry(data, key, validators)

                if (!isEmpty(validationError)) {
                    errors = {...errors, ...validationError}
                }
            }
        });

        if (!isEmpty(errors)) {
            throw new ValidationError(errors);
        }

        return data;
    }
}
