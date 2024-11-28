import {
  createTRPCRouter,
  protectedProcedure,
  VerifyRoles,
} from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { users } from "drizzle/schemas/schema";
import { z } from "zod";
import { RolesArry } from "../../../../drizzle/schemas/roles";

export const userRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userList = await ctx.db.query.users.findMany();

    return userList;
  }),
  updateRole: protectedProcedure
    .use(VerifyRoles(["ADMIN"]))
    .input(z.object({ id: z.string(), role: z.enum(RolesArry) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ roles: input.role })
        .where(eq(users.id, input.id));
    }),
});
