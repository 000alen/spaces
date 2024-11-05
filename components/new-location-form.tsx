/* eslint-disable @typescript-eslint/no-explicit-any */
import { trpc } from "@/lib/trpc-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { slugify } from "@/lib/utils";
import { useActionState } from "react";

interface NewLocationOrgProps {
  orgSlug: string;
}

export const NewLocationOrg: React.FC<NewLocationOrgProps> = ({ orgSlug }) => {
  const { mutateAsync } = trpc.createLocation.useMutation();

  const createLocation = async (_: any, formData: FormData) => {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;

    const slug = slugify(name);

    console.log("location", { name, address, slug });

    await mutateAsync({ orgSlug, location: { name, address, slug } });
  };

  const [, action, isPending] = useActionState(createLocation, null);

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold mb-4">Create Location</h2>
      <Input name="name" placeholder="Location Name" />
      <Input name="address" placeholder="Location Address" />
      <Button className="mt-4" disabled={isPending}>
        Create
      </Button>
    </form>
  );
};
