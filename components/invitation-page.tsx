"use client";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Check, X, Loader2 } from "lucide-react";

interface InvitationPageProps {
  invitationId: string;
}

export const InvitationPage: React.FC<InvitationPageProps> = ({
  invitationId,
}) => {
  const { data: invitation, isLoading } = trpc.getInvitation.useQuery({
    invitationId,
  });

  const accept = async () => {
    await authClient.organization.acceptInvitation({
      invitationId,
    });
  };

  const reject = async () => {
    await authClient.organization.rejectInvitation({
      invitationId,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Invitation Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            The invitation you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Organization Invitation
          </CardTitle>
          <CardDescription className="text-center">
            You&apos;ve been invited to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-2">
            <span className="font-semibold">{invitation.inviterName}</span> has
            invited you to join
          </p>
          <p className="text-2xl font-bold">{invitation.organizationName}</p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={accept} className="w-full sm:w-auto">
            <Check className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button
            onClick={reject}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
