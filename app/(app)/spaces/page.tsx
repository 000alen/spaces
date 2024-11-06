"use client"

import { NewOrgButton } from "@/components/new-org-button"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, UserPlus } from "lucide-react"

export default function Component() {
  const { data: session } = authClient.useSession()
  const { data: organizations } = authClient.useListOrganizations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Welcome, {session?.user?.name}!</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Organizations</span>
              <NewOrgButton />
            </CardTitle>
            <CardDescription>Manage your organizations</CardDescription>
          </CardHeader>
          <CardContent>
            {organizations && organizations.length > 0 ? (
              <ul className="space-y-2">
                {organizations.map((organization) => (
                  <li key={organization.slug}>
                    <Link
                      href={`/spaces/${organization.slug}`}
                      className="flex items-center p-2 hover:bg-secondary rounded-md transition-colors"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>{organization.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No organizations found. Create one to get started!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
            <CardDescription>Check your pending invitations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/invitations" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                View Invitations
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Manage your bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/bookings" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}