/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState } from "react";
import { trpc } from "@/lib/trpc-client";

interface NewSpaceFormProps {
  orgSlug: string;
  locationSlug: string;
}

export const NewSpaceForm: React.FC<NewSpaceFormProps> = ({
  orgSlug,
  locationSlug,
}) => {
  const { mutateAsync } = trpc.createSpace.useMutation();

  const createSpace = async (_: any, formData: FormData) => {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const isAvailable = formData.get("isAvailable") === "on";
    const x = parseInt(formData.get("x") as string);
    const y = parseInt(formData.get("y") as string);
    // const width = parseInt(formData.get("width") as string);
    // const height = parseInt(formData.get("height") as string);

    return await mutateAsync({
      orgSlug,
      locationSlug,
      space: { name, type, capacity, isAvailable, x, y },
    });
  };

  const [, action, isPending] = useActionState(createSpace, null);

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold mb-4">Create Space</h2>
      <Input name="name" placeholder="Space Name" />
      <Input name="type" placeholder="Space Type" />
      <Input name="capacity" type="number" placeholder="Capacity" />
      <Input name="isAvailable" type="checkbox" placeholder="Is Available" />
      <Input name="x" type="number" placeholder="X" />
      <Input name="y" type="number" placeholder="Y" />
      <Input name="width" type="number" placeholder="Width" />
      <Input name="height" type="number" placeholder="Height" />
      <Button className="mt-4" disabled={isPending}>
        Create
      </Button>
    </form>
  );
};
