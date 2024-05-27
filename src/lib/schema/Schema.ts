import { z } from "zod";

export const authFormSchema = (type) =>
  z.object({
    tell: z.string().min(11).max(11),
    password: z.string().min(8),
  });
