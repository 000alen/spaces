import { z } from "zod";

export const Space = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  capacity: z.number(),
  isAvailable: z.boolean(),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type Space = z.infer<typeof Space>;
