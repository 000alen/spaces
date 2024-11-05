import { SpacePage } from "@/components/location-page";

export default async function Page({
  params,
}: {
  params: Promise<{ orgSlug: string; locationSlug: string }>;
}) {
  const { orgSlug, locationSlug } = await params;

  return <SpacePage orgSlug={orgSlug} locationSlug={locationSlug} />;
}
