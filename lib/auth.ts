import { db } from "@/db";
import { getBaseUrl } from "@/lib/utils";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import * as schema from "@/db/schema";
import * as authSchema from "../auth-schema";

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      // ...schema,
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
