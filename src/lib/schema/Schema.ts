import { z } from "zod";

export const authFormSchema = (type) =>
  z.object({
    tell: z.string().min(11, { message: "نام کاربری اشتباه است" }).max(11, { message: "نام کاربری اشتباه است" }),
    password: z.string().min(8, { message: "حداقل 8 کاراکتر باید وارد شود" }),
  });
