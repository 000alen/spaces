import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "@/lib/utils";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [organizationClient()],
});
