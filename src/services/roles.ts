export enum Roles {
  ROLE_LEECHER = 1,
  ROLE_UPLOADER = 2,
  ROLE_ADMIN = 64,
}

export const hasRole = (roles: number, role: Roles) => (roles & role) === role;
export const addRole = (roles: number, role: Roles) => roles | role;
export const removeRole = (roles: number, role: Roles) => roles ^ role;

/**
 * @todo: remove this object
 */
const RolesService = {
  /**
   * @deprecated use import { Roles } from '<...>roles'
   */
  ALL: {
    ROLE_ADMIN: Roles.ROLE_ADMIN,
    ROLE_LEECHER: Roles.ROLE_LEECHER,
    ROLE_UPLOADER: Roles.ROLE_UPLOADER,
  },
  /**
   * @deprecated use import { Roles } from '<...>roles'
   */
  ROLE_ADMIN: Roles.ROLE_ADMIN,
  /**
   * @deprecated use import { Roles } from '<...>roles'
   */
  ROLE_LEECHER: Roles.ROLE_LEECHER,
  /**
   * @deprecated use import { Roles } from '<...>roles'
   */
  ROLE_UPLOADER: Roles.ROLE_UPLOADER,
  /**
   * @deprecated use import { hasRole }
   */
  hasRole,
  /**
   * @deprecated use import { addRole }
   */
  add: addRole,
  /**
   * @deprecated use import { removeRole }
   */
  remove: removeRole,
  removeRole,
  addRole,
  Roles,
};

module.exports = RolesService; // @todo: remove me
export default RolesService;
