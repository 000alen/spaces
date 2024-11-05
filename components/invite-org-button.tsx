import { InviteOrgForm } from "./invite-org-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface InviteOrgButtonProps {
  orgId: string;
  orgSlug: string;
}

export const InviteOrgButton: React.FC<InviteOrgButtonProps> = ({
  orgId,
  orgSlug,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite to Org</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-6">
        <InviteOrgForm orgId={orgId} orgSlug={orgSlug} />
      </DialogContent>
    </Dialog>
  );
};
