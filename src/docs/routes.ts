import { register } from "./user/register";

export const routes = {
  paths: {
    "/register": {
      ...register,
    },
  },
};
