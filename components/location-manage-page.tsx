"use client";

import { NewSpaceForm } from "./new-space-form";

interface LocationManagePageProps {
  orgSlug: string;
  locationSlug: string;
}

export const LocationManagePage: React.FC<LocationManagePageProps> = ({
  orgSlug,
  locationSlug,
}) => {
  return (
    <div>
      <NewSpaceForm orgSlug={orgSlug} locationSlug={locationSlug} />
    </div>
  );
};
