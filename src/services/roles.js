const ROLE_USER = 1;
const ROLE_ADMIN = 64;

module.exports = {
  ALL: {
    ROLE_ADMIN,
    ROLE_USER,
  },
  ROLE_ADMIN,
  ROLE_USER,
  hasRole: (roles, role) => (roles & role) === role,
  add: (roles, role) => roles | role,
  remove: (roles, role) => roles ^ role,
};
