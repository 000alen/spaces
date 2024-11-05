"use client";

import React from "react";
import { trpc } from "@/lib/trpc-client";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { authClient } from "@/lib/auth-client";

interface SpacePageProps {
  orgSlug: string;
  locationSlug: string;
}

export function SpacePage({ orgSlug, locationSlug }: SpacePageProps) {
  const { data: session } = authClient.useSession();
  const { data: spaces } = trpc.getSpaces.useQuery(
    { orgSlug, locationSlug },
    {
      placeholderData: [],
    }
  );

  const [date, setDate] = React.useState<Date>(new Date());
  const [selectedSpace, setSelectedSpace] = React.useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<
    [number, number]
  >([540, 1020]); // 9:00 AM to 5:00 PM in minutes
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleBooking = () => {
    setShowConfirmation(true);
  };

  const formatTimeFromMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTimeRange = (range: [number, number]) => {
    return `${formatTimeFromMinutes(range[0])} - ${formatTimeFromMinutes(
      range[1]
    )}`;
  };

  if (!spaces) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <h1 className="text-2xl font-bold text-gray-800">Spaces</h1>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              {session?.user?.name}
            </span>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="@johndoe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
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
              <div className="relative w-full h-64 bg-white rounded-lg shadow-md">
                <TooltipProvider>
                  {spaces.map((space) => (
                    <Tooltip key={space.id}>
                      <TooltipTrigger>
                        <div
                          className={`absolute rounded-md border-2 ${
                            selectedSpace === space.id
                              ? "border-blue-500 bg-blue-100"
                              : "border-gray-300 bg-gray-50"
                          } cursor-pointer transition-all hover:bg-gray-100`}
                          style={{
                            left: `${space.x}%`,
                            top: `${space.y}%`,
                            width: space.width ? `${space.width}%` : "10%",
                            height: space.height ? `${space.height}%` : "10%",
                          }}
                          onClick={() => setSelectedSpace(space.id)}
                        >
                          <span className="text-xs font-medium">
                            {space.name}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{space.name}</p>
                        <p>{space.type}</p>
                        <p>Capacity: {space.capacity}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
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
      </div>
      <aside className="w-96 bg-white border-l overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
          <div className="mb-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
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
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Time Range</h3>
            <div className="mt-4">
              <Slider
                min={540}
                max={1140}
                step={15}
                value={selectedTimeRange}
                onValueChange={(newRange) =>
                  setSelectedTimeRange(newRange as [number, number])
                }
                className="mt-6"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>9:00 AM</span>
                <span>7:00 PM</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Selected time: {formatTimeRange(selectedTimeRange)}
            </p>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleBooking}
            disabled={!selectedSpace || !selectedTimeRange}
          >
            Confirm Booking
          </Button>
        </div>
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
              <span className="font-semibold">Time:</span>{" "}
              {formatTimeRange(selectedTimeRange)}
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
