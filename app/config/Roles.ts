// permissions
export const accessAllResources = Symbol("accessAllResources");
export const crudUsers = Symbol("crudUsers");
export const getOwnResources = Symbol("getOwnResources");
export const editOwnResources = Symbol("editOwnResources");

export const ADMIN = Symbol("admin");
// ===========

// roles
const defaultRole = [
    getOwnResources,
    editOwnResources,
];

const adminRole = [
    crudUsers,
];

const superAdminRole = [
    accessAllResources,
    ...adminRole,
];

export default {
    admin: adminRole,
    superAdmin: superAdminRole,
    default: defaultRole,
}

// ==========
