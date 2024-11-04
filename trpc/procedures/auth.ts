import { procedure } from "@/trpc/trpc";
import { withAuth } from "@/trpc/middleware/with-auth";

const authProcedure = procedure.use(withAuth);

export default authProcedure;
