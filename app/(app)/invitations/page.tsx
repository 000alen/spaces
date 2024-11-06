"use client";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Check, X } from "lucide-react";

export default function Page() {
  const { data: session } = authClient.useSession();
  const { data: invitations } = trpc.getInvitations.useQuery(undefined, {
    placeholderData: [],
  });

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {session?.user?.name}!
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Invitations
          </CardTitle>
          <CardDescription>
            Manage your organization invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations && invitations.length > 0 ? (
            <ul className="space-y-4">
              {invitations.map((invitation) => (
                <li key={invitation.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-medium">
                        {invitation.inviterName} invited you to join
                      </p>
                      <p className="text-lg font-semibold">
                        {invitation.organizationName}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <Button
                        onClick={() => accept(invitation.id)}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => reject(invitation.id)}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  {invitation.id !== invitations[invitations.length - 1].id && (
                    <Separator className="my-4" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No pending invitations.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
