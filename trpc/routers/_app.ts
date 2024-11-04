import { createCallerFactory, router } from "@/trpc/trpc";
import { createContext } from "@/trpc/context";

export const appRouter = router({});

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
