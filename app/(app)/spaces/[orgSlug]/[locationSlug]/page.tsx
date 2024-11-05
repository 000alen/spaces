import { SpaceBookingPage } from "@/components/space-booking-page";

export default async function Page({
  params,
}: {
  params: Promise<{ orgSlug: string; locationSlug: string }>;
}) {
  const { orgSlug, locationSlug } = await params;

  return <SpaceBookingPage orgSlug={orgSlug} locationSlug={locationSlug} />;
}
