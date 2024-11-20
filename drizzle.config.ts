import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./drizzle/schemas",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["finance-app_*"],
} satisfies Config;
