import { NewOrgForm } from "./new-org-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export const NewOrgButton: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Organization</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-6">
        <NewOrgForm />
      </DialogContent>
    </Dialog>
  );
};
