import "reflect-metadata";

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` })

import { PrismaClient } from '@prisma/client'
import { omit } from 'lodash';
import { ApiContext } from "../types/Requests";
import { merge } from 'lodash';

type DBContext = {
    scoped?: boolean;
    tenantId?: number;
};

export interface ContextAwarePrismaClient extends PrismaClient {
    $setContext: (context: DBContext) => ContextAwarePrismaClient;
}

function addContextProxy(model: Object, _context: DBContext) {
    return new Proxy(model, {
        get(target, p, receiver) {
            const method = Reflect.get(target, p, receiver);

            if (typeof method !== 'function' || p === 'transaction') {
                return method;
            }

            return (args: unknown) => {
                if (typeof args !== 'object') {
                    return method.call(target, args);
                }

                return method.call(target, { ...args, _context });
            };
        },
    });
}

function setScope(
    this: ContextAwarePrismaClient,
    _context: DBContext
): ContextAwarePrismaClient {
    return new Proxy(this, {
        get(target, p, receiver) {
            const original = Reflect.get(target, p, receiver);

            if (
                typeof p !== 'string' ||
                /^\$.+/.test(p) ||
                typeof original !== 'object'
            ) {
                return original;
            }

            return addContextProxy(original, _context);
        },
    });
}

function setContext(
    this: ContextAwarePrismaClient,
    _context: DBContext
): ContextAwarePrismaClient {
    return new Proxy(this, {
        get(target, p, receiver) {
            const original = Reflect.get(target, p, receiver);

            if (
                typeof p !== 'string' ||
                /^\$.+/.test(p) ||
                typeof original !== 'object'
            ) {
                return original;
            }

            return addContextProxy(original, _context);
        },
    });
}

function createPrismaClient(): ContextAwarePrismaClient {
    const log = [];

    if (process.env.DEBUG) {
        log.push({
            emit: 'event',
            level: 'query',
        });
    }

    return Object.create(new PrismaClient({
        log: log,
    }), {
        $scoped: {
            value: setScope,
            enumerable: false,
            writable: false,
            configurable: false,
        },
        $setContext: {
            value: setContext,
            enumerable: false,
            writable: false,
            configurable: false,
        },
    });
}

const prismaClient = createPrismaClient();

//@ts-ignore
prismaClient.$on('query', (e) => {
    // //@ts-ignore
    // console.log('Query: ' + e.query)
    // //@ts-ignore
    // console.log('Params: ' + e.params)
    // //@ts-ignore
    // console.log('Duration: ' + e.duration + 'ms')
})

/**
 * @param tenantId
 * @param query
 */
export function tenantScope(tenantId, query) {
    // merge where.
    const where = {
        ...query?.where || {}
    };

    if (tenantId) {
        where.tenant = {
            id: tenantId,
        }
    }

    return {
        ...query,
        where: where,
    }
}

/**
 * @param query
 */
export function softDeleteScope(query) {
    // merge where.
    const queryWithDeletedAtNull = {
        where: {
            deletedAt: null,
        },
    }

    return merge(
        query,
        queryWithDeletedAtNull,
    )
}

const ModelMap = {
    User: {
        // tenantScoped: true,
        softDeleteScoped: true,
    },
}

/**
 * Initialize Prisma middleware.
 *
 * @param req
 * @private
 */
prismaClient.$use(async (params, next) => {
    if (ModelMap[params.model] && ModelMap[params.model]) {
        if (['findMany', 'find', 'findFirst', 'findFirstOrThrow', 'count', 'deleteMany', 'delete'].includes(params.action)) {
            // @ts-ignore
            if (params.args?._context?.scoped !== false) {
                // if (ModelMap[params.model].tenantScoped && params.args?._context?.tenantId) {
                //     params.args = tenantScope(params.args?._context?.tenantId, params.args)
                // }

                if (ModelMap[params.model].softDeleteScoped && !params.args?.where?.deletedAt) {
                    params.args = softDeleteScope(params.args)
                }
            }
        }
    }

    return next(omit(params, 'args._context'))
});

/**
 *
 * Potentially you can use this function to set the context based on api context.
 *
 * @example
 * if (context?.tenantId) {
 *     return prismaClient.$setContext({ ...rest, tenantId: context?.tenantId });
 * } else {
 *     return prismaClient;
 * }
 * @param context
 * @param rest
 */
const prisma = (context: ApiContext = null, rest = {}): ContextAwarePrismaClient => {
    return prismaClient;
}

export { prisma, prismaClient };
