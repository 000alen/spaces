"use client";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc-client";
import Link from "next/link";
import { NewLocationButton } from "./new-location-button";

interface OrgPageProps {
  orgSlug: string;
}

export default function OrgPage({ orgSlug }: OrgPageProps) {
  const { data: session } = authClient.useSession();
  const { data: locations } = trpc.getLocations.useQuery(
    { orgSlug },
    {
      placeholderData: [],
    }
  );

  return (
    <div>
      <div>
        <h1>Welcome, {session?.user?.name}!</h1>
      </div>

      <div>
        <h2>Locations</h2>

        <NewLocationButton orgSlug={orgSlug} />

        <ul>
          {locations?.map((location) => (
            <li key={location.slug}>
              <Link href={`/spaces/${orgSlug}/${location.slug}`}>
                {location.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
