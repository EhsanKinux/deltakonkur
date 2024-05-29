import { z } from "zod";

export const authFormSchema = (type) =>
  z.object({
    tell: z.string().min(11, { message: "نام کاربری اشتباه است" }).max(11, { message: "نام کاربری اشتباه است" }),
    password: z.string().min(8, { message: "حداقل 8 کاراکتر باید وارد شود" }),
  });

export const registerFormSchema = () =>
  z.object({
    name: z.string(),
    lastName: z.string(),
    school: z.string(),
    cellphone: z.string(),
    tellphone: z.string(),
    parentsPhone: z.string(),
    major: z.string(),
    grade: z.string(),
  });
