import { LocationManagePage } from "@/components/location-manage-page";

export default async function Page({
  params,
}: {
  params: Promise<{
    orgSlug: string;
    locationSlug: string;
  }>;
}) {
  const { orgSlug, locationSlug } = await params;

  return <LocationManagePage orgSlug={orgSlug} locationSlug={locationSlug} />;
}
