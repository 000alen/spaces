"use client"

import { authClient } from "@/lib/auth-client"
import { trpc } from "@/lib/trpc-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Building } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  const { data: session } = authClient.useSession()
  const { data: bookings } = trpc.getBookings.useQuery(undefined, {
    placeholderData: [],
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Welcome, {session?.user?.name}!</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Your Bookings
          </CardTitle>
          <CardDescription>View and manage your space bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings && bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Space {booking.spaceId}</span>
                      <span className="text-sm text-muted-foreground">{booking.organizationName}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {booking.locationName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {booking.id !== bookings[bookings.length - 1].id && (
                    <Separator className="my-4" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No bookings found</p>
              <p className="text-muted-foreground">You haven&apos;t made any bookings yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}