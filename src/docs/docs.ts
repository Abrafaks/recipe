import { basicInfo } from "./basicInfo";
import { servers } from "./servers";
import { tags } from "./tags";
import { components } from "./components";
import { register } from "./user/register";

export default {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  ...register,
};
