import { z } from "zod";

export const authFormSchema = () =>
  z.object({
    tell: z.string().min(11, { message: "نام کاربری اشتباه است" }).max(11, { message: "نام کاربری اشتباه است" }),
    password: z.string().min(8, { message: "حداقل 8 کاراکتر باید وارد شود" }),
  });

export const registerFormSchema = () =>
  z.object({
    first_name: z.string(),
    last_name: z.string(),
    school: z.string(),
    phone_number: z.string(),
    home_phone: z.string(),
    parent_phone: z.string(),
    field: z.string(),
    grade: z.string(),
  });
