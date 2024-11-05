"use client";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc-client";

export default function Page() {
  const { data: session } = authClient.useSession();
  const { data: bookings } = trpc.getBookings.useQuery(undefined, {
    placeholderData: [],
  });

  return (
    <div>
      <div>
        <h1>Welcome, {session?.user?.name}!</h1>
      </div>

      <div>
        <h2>Bookings</h2>

        <ul>
          {bookings?.map((booking) => (
            <li key={booking.id}>
              Space {booking.spaceId} from {booking.organizationName} at
              location {booking.locationName} from{" "}
              {new Date(booking.startTime).toLocaleString()} to{" "}
              {new Date(booking.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
