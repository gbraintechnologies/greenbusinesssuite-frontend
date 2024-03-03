import * as localService from "./localService";

// Features
import * as authService from "./features/authService";
import * as userManagementService from "./features/userManagementService";

import * as rolesService from "./features/rolesService";

import * as appService from "./features/appService";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...localService,
  ...authService,
  ...userManagementService,
  ...rolesService,
  ...appService,
};
