/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { slugify } from "@/lib/utils";
import { useActionState } from "react";

const createOrg = async (_: any, formData: FormData) => {
  const name = formData.get("name") as string;

  const slug = slugify(name);

  return await authClient.organization.create(
    {
      name,
      slug,
    },
    {
      onSuccess: () => {},
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    }
  );
};

export const NewOrgForm: React.FC = () => {
  const [, action, isPending] = useActionState(createOrg, null);

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold mb-4">Create Organization</h2>
      <Input name="name" placeholder="Organization Name" />
      <Button className="mt-4" disabled={isPending}>
        Create
      </Button>
    </form>
  );
};
