import OrgPage from "@/components/org-page";

export default async function Page({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  return <OrgPage orgSlug={orgSlug} />;
}
