import { createCallerFactory, router } from "@/trpc/trpc";
import { createContext } from "@/trpc/context";
import { z } from "zod";
import publicProcedure from "@/trpc/procedures/public";
import { OrgInviteEmail } from "@/components/emails/org-invite";
import { resend } from "@/lib/email";
import { BookingEmail } from "@/components/emails/booking";

export const internalRouter = router({
  sendInvitationEmail: publicProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.string(),
        email: z.string().email(),
        organization: z.object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
        }),
        inviter: z.object({
          id: z.string(),
          email: z.string().email(),
          organizationId: z.string(),
          userId: z.string(),
          role: z.string(),
          user: z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
          }),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const inviteLink = `https://spaces.vercel.app/invitations/${input.id}`;

      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [input.email],
        subject: `You're invited to join ${input.organization.name}`,
        react: OrgInviteEmail({
          orgName: input.organization.name,
          inviteLink,
        }),
      });
    }),

  sendBookingEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        orgSlug: z.string(),
        locationSlug: z.string(),
        spaceId: z.string(),
        startTime: z.date(),
        endTime: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [input.email],
        subject: `Booking confirmation for ${input.orgSlug} at ${input.locationSlug}`,
        react: BookingEmail(input),
      });
    }),
});

export const createInternalCaller = createCallerFactory(internalRouter);

export const createAsyncInternalCaller = async () => {
  const context = await createContext();
  return createInternalCaller(context);
};

export type InternalRouter = typeof internalRouter;
