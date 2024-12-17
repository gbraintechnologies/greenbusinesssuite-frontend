import * as localService from "./localService";

// Features
import * as authService from "./features/authService";
import * as userManagementService from "./features/userManagementService";

import * as rolesService from "./features/rolesService";

import * as currencyService from "./features/currencyService";

import * as appService from "./features/appService";

import * as formsService from "./features/formsService";

import * as reportService from "./features/reportService";

import * as companyService from "./features/companyService";

import * as jurisdictionService from "./features/jurisdictionsService";

import * as sectorService from "./features/sectorService";

import * as documentService from "./features/documentService";

import * as notificationService from "./features/notificationService";

import * as categoryService from "./features/categoryService";

import * as coreModuleService from "./features/coreModuleService";

import * as mediaService from "./features/mediaService";


// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...localService,
  ...authService,
  ...userManagementService,
  ...rolesService,
  ...companyService,
  ...appService,
  ...formsService,
  ...currencyService,
  ...jurisdictionService,
  ...sectorService,
  ...reportService,
  ...documentService,
  ...categoryService,
  ...notificationService,
  ...coreModuleService,
  ...mediaService
};
