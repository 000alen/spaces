"use client";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc-client";
import { skipToken } from "@tanstack/react-query";

export default function Page() {
  const { data: session } = authClient.useSession();
  const { data: invitations } = trpc.getInvitations.useQuery(
    !!session ? { userId: session?.user.id ?? "" } : skipToken,
    {
      placeholderData: [],
    }
  );

  const accept = async (invitationId: string) => {
    await authClient.organization.acceptInvitation({
      invitationId,
    });
  };

  const reject = async (invitationId: string) => {
    await authClient.organization.rejectInvitation({
      invitationId,
    });
  };

  return (
    <div>
      <div>
        <h1>Welcome, {session?.user?.name}!</h1>
      </div>

      <div>
        <h2>Invitations</h2>

        <ul>
          {invitations?.map((invitation) => (
            <li key={invitation.id}>
              <div>
                <div>
                  {invitation.inviterName} invited you to join{" "}
                  {invitation.organizationName}
                </div>
                <div>
                  <button onClick={() => accept(invitation.id)}>Accept</button>
                  <button onClick={() => reject(invitation.id)}>Reject</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
