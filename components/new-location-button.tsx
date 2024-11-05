import { NewLocationOrg } from "./new-location-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface NewLocationButtonProps {
  orgSlug: string;
}

export const NewLocationButton: React.FC<NewLocationButtonProps> = ({
  orgSlug,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Location</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-6">
        <NewLocationOrg orgSlug={orgSlug} />
      </DialogContent>
    </Dialog>
  );
};
