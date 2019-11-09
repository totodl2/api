const ROLE_LEECHER = 1;
const ROLE_UPLOADER = 2;
const ROLE_ADMIN = 64;

module.exports = {
  ALL: {
    ROLE_ADMIN,
    ROLE_LEECHER,
    ROLE_UPLOADER,
  },
  ROLE_ADMIN,
  ROLE_LEECHER,
  ROLE_UPLOADER,
  hasRole: (roles, role) => (roles & role) === role,
  add: (roles, role) => roles | role,
  remove: (roles, role) => roles ^ role,
};
