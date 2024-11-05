interface BookingEmailProps {
  orgSlug: string;
  locationSlug: string;
  spaceId: string;
  startTime: Date;
  endTime: Date;
}

export const BookingEmail = ({
  orgSlug,
  locationSlug,
  spaceId,
  startTime,
  endTime,
}: BookingEmailProps) => {
  return (
    <div>
      <h1>Booking Confirmation</h1>
      <p>
        You have successfully booked a space ({spaceId}) at {orgSlug} in{" "}
        {locationSlug} from {startTime.toLocaleString()} to{" "}
        {endTime.toLocaleString()}
      </p>
    </div>
  );
};
