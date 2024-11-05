import { createCallerFactory, router } from "@/trpc/trpc";
import { createContext } from "@/trpc/context";
import authProcedure from "@/trpc/procedures/auth";
import { z } from "zod";
import { ensureUserIsMember, getOrgIdFromSlug } from "@/lib/auth";
import { db } from "@/db";
import * as authSchema from "../../auth-schema";
import * as schema from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomId } from "@/lib/utils";

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

  createLocation: authProcedure
    .input(
      z.object({
        orgSlug: z.string(),
        location: z.object({
          name: z.string(),
          slug: z.string(),
          address: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input: { orgSlug, location } }) => {
      await ensureUserIsMember(ctx.session.user.id, orgSlug);

      const orgId = await getOrgIdFromSlug(orgSlug);

      return await db.insert(schema.location).values({
        id: randomId(),
        name: location.name,
        slug: location.slug,
        address: location.address,
        organizationId: orgId,
      });
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
          x: schema.space.x,
          y: schema.space.y,
          width: schema.space.width,
          height: schema.space.height,
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

  getInvitations: authProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input: { userId }, ctx }) => {
      // Verify user is accessing their own invitations
      if (ctx.session.user.id !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own invitations.",
        });
      }

      const { email } = ctx.session.user;
      // Fetch active invitations with organization and inviter details
      const data = await db
        .select({
          id: authSchema.invitation.id,
          role: authSchema.invitation.role,
          expiresAt: authSchema.invitation.expiresAt,
          inviterId: authSchema.invitation.inviterId,
          inviterName: authSchema.user.name,
          organizationId: authSchema.invitation.organizationId,
          organizationName: authSchema.organization.name,
        })
        .from(authSchema.invitation)
        .leftJoin(
          authSchema.organization,
          eq(authSchema.organization.id, authSchema.invitation.organizationId)
        )
        .leftJoin(
          authSchema.user,
          eq(authSchema.user.id, authSchema.invitation.inviterId)
        )
        .where(
          and(
            gt(authSchema.invitation.expiresAt, new Date()),
            eq(authSchema.invitation.status, "pending"),
            eq(authSchema.invitation.email, email)
          )
        );

      return data;
    }),

  getInvitation: authProcedure
    .input(
      z.object({
        invitationId: z.string(),
      })
    )
    .query(async ({ input: { invitationId }, ctx }) => {
      const { email } = ctx.session.user;
      const data = await db
        .select({
          id: authSchema.invitation.id,
          role: authSchema.invitation.role,
          expiresAt: authSchema.invitation.expiresAt,
          inviterId: authSchema.invitation.inviterId,
          inviterName: authSchema.user.name,
          organizationId: authSchema.invitation.organizationId,
          organizationName: authSchema.organization.name,
        })
        .from(authSchema.invitation)
        .leftJoin(
          authSchema.organization,
          eq(authSchema.organization.id, authSchema.invitation.organizationId)
        )
        .leftJoin(
          authSchema.user,
          eq(authSchema.user.id, authSchema.invitation.inviterId)
        )
        .where(
          and(
            eq(authSchema.invitation.id, invitationId),
            eq(authSchema.invitation.email, email)
          )
        );

      return data[0];
    }),
});

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
