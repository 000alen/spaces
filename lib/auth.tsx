import { db } from "@/db";
import { getBaseUrl } from "@/lib/utils";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "../auth-schema";
import * as schema from "@/db/schema";
import { organization } from "better-auth/plugins";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { resend } from "./email";
import { OrgInviteEmail } from "@/components/emails/org-invite";

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `https://spaces.vercel.app/invitations/${data.id}`;

        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: [data.email],
          subject: `You're invited to join ${data.organization.name}`,
          react: (
            <OrgInviteEmail
              orgName={data.organization.name}
              inviteLink={inviteLink}
            />
          ),
        });
      },
    }),
  ],
});

/**
 * Verifies if a user is a member of a specific organization
 * @param userId - The ID of the user to check
 * @param orgSlug - The slug of the organization
 * @throws {TRPCError} If user is not a member of the organization
 */
export const ensureUserIsMember = async (userId: string, orgSlug: string) => {
  const membership = await db
    .select()
    .from(authSchema.member)
    .leftJoin(
      authSchema.organization,
      eq(authSchema.organization.id, authSchema.member.organizationId)
    )
    .where(
      and(
        eq(authSchema.member.userId, userId),
        eq(authSchema.organization.slug, orgSlug)
      )
    )
    .limit(1);

  if (membership.length === 0) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this organization.",
    });
  }
};