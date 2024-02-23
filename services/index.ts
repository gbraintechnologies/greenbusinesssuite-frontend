import * as localService from "./localService";

// Features
import * as authService from "./features/authService";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...localService,
  ...authService,
};
