"use client";

import { NewOrgButton } from "@/components/new-org-button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Page() {
  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();

  return (
    <div>
      <div>
        <h1>Welcome, {session?.user?.name}!</h1>
      </div>

      <div>
        <h2>Organizations</h2>

        <NewOrgButton />

        <ul>
          {organizations?.map((organization) => (
            <li key={organization.slug}>
              <Link href={`/spaces/${organization.slug}`}>
                {organization.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Looking for your invitations?</h2>
        <Link href="/invitations">Go!</Link>
      </div>
    </div>
  );
}
