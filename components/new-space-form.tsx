/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActionState } from "react"
import { trpc } from "@/lib/trpc-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewSpaceFormProps {
  orgSlug: string
  locationSlug: string
}

export const NewSpaceForm: React.FC<NewSpaceFormProps> = ({
  orgSlug,
  locationSlug,
}) => {
  const { mutateAsync } = trpc.createSpace.useMutation()

  const createSpace = async (_: any, formData: FormData) => {
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const capacity = parseInt(formData.get("capacity") as string)
    const isAvailable = formData.get("isAvailable") === "on"
    const x = parseInt(formData.get("x") as string)
    const y = parseInt(formData.get("y") as string)
    const width = parseInt(formData.get("width") as string)
    const height = parseInt(formData.get("height") as string)

    return await mutateAsync({
      orgSlug,
      locationSlug,
      space: { name, type, capacity, isAvailable, x, y, width, height },
    })
  }

  const [, action, isPending] = useActionState(createSpace, null)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Space</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Space Name</Label>
            <Input id="name" name="name" placeholder="Enter space name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Space Type</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select space type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting Room</SelectItem>
                <SelectItem value="desk">Desk</SelectItem>
                <SelectItem value="lounge">Lounge</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" name="capacity" type="number" placeholder="Enter capacity" required min="1" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isAvailable">Available</Label>
            <Switch id="isAvailable" name="isAvailable" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x">X Coordinate</Label>
              <Input id="x" name="x" type="number" placeholder="X" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y">Y Coordinate</Label>
              <Input id="y" name="y" type="number" placeholder="Y" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input id="width" name="width" type="number" placeholder="Width" required min="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input id="height" name="height" type="number" placeholder="Height" required min="1" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create Space"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}