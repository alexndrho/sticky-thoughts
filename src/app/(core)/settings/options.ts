import { queryOptions } from "@tanstack/react-query";

import { userOptions } from "../user/options";
import { getUserProfile } from "@/services/user";

export const userProfileOptions = queryOptions({
  queryKey: [...userOptions.queryKey, "profile"],
  queryFn: getUserProfile,
});
