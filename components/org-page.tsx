"use client"

import { authClient } from "@/lib/auth-client"
import { trpc } from "@/lib/trpc-client"
import Link from "next/link"
import { NewLocationButton } from "./new-location-button"
import { InviteOrgButton } from "./invite-org-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface OrgPageProps {
  orgId: string
  orgSlug: string
}

export default function OrgPage({ orgId, orgSlug }: OrgPageProps) {
  const { data: session } = authClient.useSession()
  const { data: locations } = trpc.getLocations.useQuery(
    { orgSlug },
    {
      placeholderData: [],
    }
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}!</h1>
        <InviteOrgButton orgId={orgId} orgSlug={orgSlug} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Locations</span>
            <NewLocationButton orgSlug={orgSlug} />
          </CardTitle>
          <CardDescription>Manage your organization&apos;s locations</CardDescription>
        </CardHeader>
        <CardContent>
          {locations && locations.length > 0 ? (
            <ul className="space-y-2">
              {locations.map((location) => (
                <li key={location.slug}>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href={`/spaces/${orgSlug}/${location.slug}`} className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{location.name}</span>
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No locations found. Create one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}