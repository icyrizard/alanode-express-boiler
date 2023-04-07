import { parseISO } from "date-fns";
import { isEmpty } from 'lodash';
import { getSortMapByKey } from "./functions";

export const required = function (value) {
    return !!value;
}

export const string = function (value) {
    return typeof value === 'string';
}

export const isoDate = function (value) {
    return !!parseISO(value);
}

export const integer = function (value) {
    return !isNaN(parseInt(value));
}

export const max = function (value, params) {
    return value <= params;
}

export const min = function (value, params) {
    return value >= params;
}

export const numeric = function (value) {
    return !isNaN(parseFloat(value));
}

export const number = function (value) {
    if (typeof value === "string") {
        return false
    }

    return !isNaN(parseFloat(value));
}

export const oneOf = function (value, params) {
    const options = params.split(',');

    return options.includes(value);
}

export const email = function (value) {
    const regExp = new RegExp(/^[a-zA-Z0-9\.\+\_]+@([\w-]+\.)+[\w-]{2,4}$/);

    return regExp.test(value);
}

/**
 * ^                         Start anchor
 * (?=.*[A-Z])               Ensure string has one uppercase letters.
 * (?=.*[!@#$&*])            Ensure string has one special case letter.
 * (?=.*[a-z])               Ensure string has one lowercase letters.
 * .{8}                      Ensure string is of length 8.
 * $                         End anchor.
 *
 * @param value
 */
export const weakPassword = function (value) {
    const regExp = new RegExp(/(?=.*[a-z])(?=.{8,})/);

    return regExp.test(value);
}

export const iban = function (value) {
    const regExp = new RegExp(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,32}$/);

    return regExp.test(value);
}

export const sortBy = function (value) {
    if (!string(value)) {
        return
    }

    const sortBy = value.split(',') || [];
    const sortMapByKey = getSortMapByKey(sortBy);

    for (const [key, direction] of Object.entries(sortMapByKey)) {
        if (!oneOf(direction, 'asc,desc')) {
            return false;
        }
    }

    return true;
}

export const phone = function (value) {
    const regExp = new RegExp(/^(\+?[0-9]{6,17}$)/)

    return regExp.test(value);
}

export const minLength = function (value, length = 1, nullable = false) {
    if (value === null && nullable) {
        return true;
    }

    if (!string(value)) {
        return false;
    }

    return value.length >= length;
}

export const notEmpty = function (value) {
    return !isEmpty(value)
}

export const maxLength = function (value, length = 1, nullable = false) {
    if (value === null && nullable) {
        return true;
    }

    if (!string(value)) {
        return false;
    }

    return value.length <= length;
}

export const array = function (value) {
    return Array.isArray(value);
}

export const nullable = function (value) {
    return !(value === null);
}
