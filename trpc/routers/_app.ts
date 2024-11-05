import { createCallerFactory, router } from "@/trpc/trpc";
import { createContext } from "@/trpc/context";
import authProcedure from "@/trpc/procedures/auth";
import { z } from "zod";
import { ensureUserIsMember } from "@/lib/auth";
import { db } from "@/db";
import * as authSchema from "../../auth-schema";
import * as schema from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const appRouter = router({
  getLocations: authProcedure
    .input(
      z.object({
        orgSlug: z.string(),
      })
    )
    .query(async ({ ctx, input: { orgSlug } }) => {
      await ensureUserIsMember(ctx.session.user.id, orgSlug);

      const locations = await db
        .select({
          id: schema.location.id,
          name: schema.location.name,
          slug: schema.location.slug,
          address: schema.location.address,
        })
        .from(schema.location)
        .leftJoin(
          authSchema.organization,
          eq(authSchema.organization.id, schema.location.organizationId)
        )
        .where(eq(authSchema.organization.slug, orgSlug));

      return locations;
    }),

  getSpaces: authProcedure
    .input(
      z.object({
        orgSlug: z.string(),
        locationSlug: z.string(),
      })
    )
    .query(async ({ ctx, input: { orgSlug, locationSlug } }) => {
      await ensureUserIsMember(ctx.session.user.id, orgSlug);

      const spaces = await db
        .select({
          id: schema.space.id,
          name: schema.space.name,
          type: schema.space.type,
          capacity: schema.space.capacity,
          isAvailable: schema.space.isAvailable,
        })
        .from(schema.space)
        .leftJoin(
          schema.location,
          eq(schema.location.id, schema.space.locationId)
        )
        .leftJoin(
          authSchema.organization,
          eq(authSchema.organization.id, schema.location.organizationId)
        )
        .where(
          and(
            eq(authSchema.organization.slug, orgSlug),
            eq(schema.location.slug, locationSlug)
          )
        );

      return spaces;
    }),
});

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
