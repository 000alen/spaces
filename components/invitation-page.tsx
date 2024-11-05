"use client";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc-client";

interface InvitationPageProps {
  invitationId: string;
}

export const InvitationPage: React.FC<InvitationPageProps> = ({
  invitationId,
}) => {
  const { data: invitation } = trpc.getInvitation.useQuery({ invitationId });

  const accept = async () => {
    authClient.organization.acceptInvitation({
      invitationId,
    });
  };

  const reject = async () => {
    authClient.organization.rejectInvitation({
      invitationId,
    });
  };

  if (!invitation) return <div>Invitation not found</div>;

  return (
    <div>
      <div>
        <div>
          {invitation.inviterName} invited you to join{" "}
          {invitation.organizationName}
        </div>
        <div>
          <button onClick={accept}>Accept</button>
          <button onClick={reject}>Reject</button>
        </div>
      </div>
    </div>
  );
};
