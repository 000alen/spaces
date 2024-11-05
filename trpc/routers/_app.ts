import { createCallerFactory, router } from "@/trpc/trpc";
import { createContext } from "@/trpc/context";
import authProcedure from "@/trpc/procedures/auth";
import { z } from "zod";
import { ensureUserIsMember, getOrgIdFromSlug } from "@/lib/auth";
import { db } from "@/db";
import * as authSchema from "../../auth-schema";
import * as schema from "@/db/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { randomId } from "@/lib/utils";
import { createAsyncInternalCaller } from "./_internal";

const getLocationIdFromSlug = async (orgSlug: string, locationSlug: string) => {
  const location = await db
    .select({
      id: schema.location.id,
    })
    .from(schema.location)
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

  return location[0].id;
};

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

  createSpace: authProcedure
    .input(
      z.object({
        orgSlug: z.string(),
        locationSlug: z.string(),
        space: z.object({
          name: z.string(),
          type: z.string(),
          capacity: z.number(),
          isAvailable: z.boolean(),
          x: z.number(),
          y: z.number(),
          width: z.number().optional(),
          height: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input: { orgSlug, locationSlug, space } }) => {
      await ensureUserIsMember(ctx.session.user.id, orgSlug);

      const locationId = await getLocationIdFromSlug(orgSlug, locationSlug);

      return await db.insert(schema.space).values({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: randomId(),
        locationId,
        name: space.name,
        type: space.type,
        capacity: space.capacity,
        isAvailable: space.isAvailable,
        x: space.x,
        y: space.y,
        // width: space.width,
        // height: space.height,
      });
    }),

  getBookings: authProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: schema.booking.id,
        organizationSlug: authSchema.organization.slug,
        organizationName: authSchema.organization.name,
        locationSlug: schema.location.slug,
        locationName: schema.location.name,
        spaceId: schema.booking.spaceId,
        startTime: schema.booking.startTime,
        endTime: schema.booking.endTime,
      })
      .from(schema.booking)
      .leftJoin(
        authSchema.organization,
        eq(authSchema.organization.id, schema.booking.organizationId)
      )
      .leftJoin(schema.space, eq(schema.space.id, schema.booking.spaceId))
      .leftJoin(
        schema.location,
        eq(schema.location.id, schema.space.locationId)
      )
      .where(eq(schema.booking.userId, ctx.session.user.id))
      .orderBy(desc(schema.booking.startTime));
  }),

  createBooking: authProcedure
    .input(
      z.object({
        orgSlug: z.string(),
        locationSlug: z.string(),
        spaceId: z.string(),
        booking: z.object({
          startTime: z.date(),
          endTime: z.date(),
        }),
      })
    )
    .mutation(
      async ({ ctx, input: { orgSlug, locationSlug, spaceId, booking } }) => {
        await ensureUserIsMember(ctx.session.user.id, orgSlug);

        const organizationId = await getOrgIdFromSlug(orgSlug);

        await db.insert(schema.booking).values({
          id: randomId(),
          spaceId,
          userId: ctx.session.user.id,
          organizationId,
          startTime: booking.startTime,
          endTime: booking.endTime,
        });

        const trpc = await createAsyncInternalCaller();
        await trpc.sendBookingEmail({
          email: ctx.session.user.email,
          orgSlug,
          locationSlug,
          spaceId,
          startTime: booking.startTime,
          endTime: booking.endTime,
        });
      }
    ),

  getInvitations: authProcedure.query(async ({ ctx }) => {
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
