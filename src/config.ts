import { z } from "zod";

const ConfigSchema = z.object({
  KEEPA_API_KEY: z.string().min(1, "KEEPA_API_KEY is required"),
});

export const getConfig = () => {
  const result = ConfigSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ` - ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`❌ Invalid configuration:\n${issues}\nPlease set the required environment variables in .env file or system environment.`);
  }

  return result.data;
};

export const config = getConfig();
