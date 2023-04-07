import jwt from 'jsonwebtoken';
import { JwtAuthDecoded } from "../types/Auth";
import { get, isEmpty } from 'lodash';
import { ParsedQs } from "qs";
import { FilterMapType, SortByMapType } from "../types/Filter";
import validations from "../messages/en/validations";
import { merge } from "lodash";
import { parse } from "date-fns";

export type QueryParams = {
  [key: string]: string;
}

export const uses = function ({ context, fn, ...args }) {
  return async (req, res, next) => {
    try {
      await fn.apply(context, [req, res, next, args])
    } catch (error) {
      next(error);
    }

    // console.log({result})
    //
    // // @ts-ignore
    // result.catch((error) => {
    // });
  } }

export const jwtEncode = function (data, expiresIn = "7d", secret = process.env.JWT_SECRET) {
  return jwt.sign({
    ...data,
    iat: Math.floor(Date.now() / 1000) - 30
  }, secret, {
    algorithm: 'HS256',
    expiresIn: expiresIn,
  });
}

/**
 * Parse value to type
 *
 * @param value
 * @param type
 */
function parseToType(value, type: "int" | "string" | "boolean") {
  return {
    'int': () => parseInt(value),
    'string': () => value.toString(),
    'boolean': () => value === 'true',
    'date': () => parse(value, 'dd-MM-yy', new Date()),
  }[type]()
}

export function validationMessage(validatorKey, params = {}) {
  let messageTemplate = get(validations, validatorKey) ?? validations['default'];

  messageTemplate = messageTemplate.replace(":value", params);

  return messageTemplate.replace(":value", params);
}

export function getSortMapByKey(sortMap) {
  const result = {};

  for (const item of sortMap) {
    const [field, order] = item.split(':');
    result[field] = order;
  }

  return result;
}

export function getQuerySortBy(sortMap: SortByMapType, queryParams: ParsedQs) {
  const orderBy = [];
  const orderByRelated = {};

  //@ts-ignore
  const sortBy = queryParams.sortBy ? queryParams?.sortBy.split(','): [];
  const sortMapByKey = getSortMapByKey(sortBy);

  for (const [key, sortEntry] of Object.entries(sortMap)) {
    if (sortMapByKey[sortEntry.topic]) {
      if (sortEntry.relatedModel) {
        orderByRelated[sortEntry.relatedModel] = {
          [sortEntry.topic]: sortMapByKey[sortEntry.topic]
        }
      } else {
        orderBy.push({
          [key]: sortMapByKey[sortEntry.topic]
        })
      }
    }
  }

  return {
    orderBy,
    orderByRelated,
    sortMapByKey,
  };
}

/**
 * Generates a prisma compatible query from a filterMap and QueryParams obj
 *
 * @param filterMap
 * @param queryParams
 */
export function getQueryFilter(filterMap: FilterMapType, queryParams: ParsedQs): { where: any, include: any } {
  const where = {};
  const include = {}

  for (const [key, filterEntry] of Object.entries(filterMap)) {
    if (queryParams[filterEntry.topic]) {
      if (filterEntry.inclFn) {
        const query = filterEntry.inclFn(parseToType(queryParams[filterEntry.topic], filterEntry.type ?? "string"), queryParams);

        const whereKey = filterEntry.relatedModel ?? filterEntry.key ?? key;

        const currInclude = include[whereKey] ?? {};
        include[whereKey] = merge(currInclude, query);

        if (!filterEntry.fn) {
          continue;
        }
      }

      if (filterEntry.fn) {
        const query = filterEntry.fn(parseToType(queryParams[filterEntry.topic], filterEntry.type ?? "string"), queryParams);

        const whereKey = filterEntry.relatedModel ?? filterEntry.key ?? key;

        const currWhere = where[whereKey] ?? {};
        where[whereKey] = merge(currWhere, query);

        continue;
      }

      if (filterEntry.include) {
        include[key] = {
          where: {
            [filterEntry.relatedModel]: {
              [filterEntry.field]: {
                [filterEntry.operator]: parseToType(queryParams[filterEntry.topic], filterEntry.type ?? "string"),
                ...(filterEntry.mode ? {mode: filterEntry.mode} : {})
              }
            }
          }
        }
      } else if (filterEntry.nested) {
        where[filterEntry.relatedModel] = {
          every: {
            [filterEntry.field]: {
              [filterEntry.operator]: parseToType(queryParams[filterEntry.topic], filterEntry.type ?? "string"),
              ...(filterEntry.mode ? {mode: filterEntry.mode} : {})
            }
          }
        }
      } else {
        where[key] = {
          [filterEntry.operator]: parseToType(queryParams[filterEntry.topic], filterEntry.type ?? "string"),
          ...(filterEntry.mode ? {mode: filterEntry.mode} : {})
        }
      }
    }
  }

  return { where, include };
}

export const jwtDecode = function (token, secret = process.env.JWT_SECRET): JwtAuthDecoded {
  return jwt.verify(token, secret) as JwtAuthDecoded;
}

export const capitalize = function (str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function transformList<T>(transform: Function, includeAdminFields = false) {
  return function (list: T[]) {
    if (isEmpty(list)) {
      return [];
    }

    return list.map((entry) => {
      return transform(entry, includeAdminFields)
    });
  }
}

