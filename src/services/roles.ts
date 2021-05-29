export enum Roles {
  ROLE_LEECHER = 1,
  ROLE_UPLOADER = 2,
  ROLE_ADMIN = 64,
}

export const hasRole = (roles: number, role: Roles) => (roles & role) === role;
export const addRole = (roles: number, role: Roles) => roles | role;
export const removeRole = (roles: number, role: Roles) => roles ^ role;
