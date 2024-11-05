/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState } from "react";
import { authClient } from "@/lib/auth-client";

interface InviteOrgFormProps {
  orgId: string;
  orgSlug: string;
}

export const InviteOrgForm: React.FC<InviteOrgFormProps> = ({ orgId }) => {
  const createInvitation = async (_: any, formData: FormData) => {
    const email = formData.get("email") as string;

    await authClient.organization.inviteMember(
      {
        organizationId: orgId,
        email,
        role: "member",
      }
      // {
      //   onSuccess: () => {},
      //   onError: (ctx) => {},
      // }
    );
  };

  const [, action, isPending] = useActionState(createInvitation, null);

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold mb-4">Invite to Org</h2>
      <Input name="email" type="email" placeholder="Email" />
      <Button className="mt-4" disabled={isPending}>
        Invite
      </Button>
    </form>
  );
};
