"use client";

import React from "react";
import { trpc } from "@/lib/trpc-client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { LocationLayout } from "./location-layout";

interface SpacePageProps {
  orgSlug: string;
  locationSlug: string;
}

export function SpacePage({ orgSlug, locationSlug }: SpacePageProps) {
  const { data: spaces } = trpc.getSpaces.useQuery(
    { orgSlug, locationSlug },
    {
      placeholderData: [],
    }
  );

  const { mutateAsync } = trpc.createBooking.useMutation();

  const [date, setDate] = React.useState<Date>(new Date());
  const [selectedSpace, setSelectedSpace] = React.useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleBooking = async () => {
    await mutateAsync({
      orgSlug,
      locationSlug,
      spaceId: selectedSpace!,
      booking: {
        startTime: new Date(date.setHours(9, 0, 0, 0)),
        endTime: new Date(date.setHours(17, 0, 0, 0)),
      },
    });

    setShowConfirmation(true);
  };

  if (!spaces) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Book a Workspace
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setDate(new Date(date.setDate(date.getDate() - 1)))
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center rounded-lg bg-white px-3 py-2">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                <span className="text-sm font-medium">
                  {date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setDate(new Date(date.setDate(date.getDate() + 1)))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Office Layout</h3>
            <LocationLayout
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              spaces={spaces as any}
              selectedSpace={selectedSpace}
              setSelectedSpace={setSelectedSpace}
            />
          </div>
          <h3 className="text-xl font-semibold mb-4">Available Spaces</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {spaces.map((space) => (
              <Card
                key={space.id}
                className={`cursor-pointer transition-all ${
                  selectedSpace === space.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedSpace(space.id)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{space.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{space.type}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Capacity: {space.capacity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <aside className="w-96 bg-white border-l overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border w-full"
          />
        </div>

        {selectedSpace && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Selected Space</h3>
            <p className="text-gray-600">
              {spaces.find((s) => s.id === selectedSpace)?.name}
            </p>
            <p className="text-gray-600">
              {spaces.find((s) => s.id === selectedSpace)?.type}
            </p>
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handleBooking}
          disabled={!selectedSpace}
        >
          Confirm Booking
        </Button>
      </aside>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Your workspace has been successfully booked.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Date:</span>{" "}
              {date.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Space:</span>{" "}
              {spaces.find((s) => s.id === selectedSpace)?.name}
            </p>
          </div>
          <Button className="mt-4" onClick={() => setShowConfirmation(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
