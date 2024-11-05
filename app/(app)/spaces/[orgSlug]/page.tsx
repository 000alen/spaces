import OrgPage from "@/components/org-page";
import { getOrgIdFromSlug } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const orgId = await getOrgIdFromSlug(orgSlug);

  return <OrgPage orgId={orgId} orgSlug={orgSlug} />;
}
