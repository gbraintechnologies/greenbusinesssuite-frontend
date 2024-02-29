import * as localService from "./localService";

// Features
import * as authService from "./features/authService";
import * as userManagementService from "./features/userManagementService";

import * as rolesService from "./features/rolesService";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...localService,
  ...authService,
  ...userManagementService,
  ...rolesService,
};
