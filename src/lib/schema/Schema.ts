import { z } from "zod";

export const authFormSchema = () =>
  z.object({
    tell: z.string().min(11, { message: "نام کاربری اشتباه است" }).max(11, { message: "نام کاربری اشتباه است" }),
    password: z.string().min(8, { message: "حداقل 8 کاراکتر باید وارد شود" }),
  });

export const editAdvisorFormSchema = () =>
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
    field: z.string(),
    bank_account: z.string(),
    national_id: z.string(),
  });

export const editStudentFormSchema = () =>
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    school: z.string(),
    phone_number: z.string(),
    home_phone: z.string(),
    parent_phone: z.string(),
    field: z.string(),
    grade: z.string(),
    created: z.string(),
    advisor: z.string().min(1, { message: "مشاور دانش آموز را تعیین کنید!" }),
    date_of_birth: z.string().min(1, { message: "تاریخ تولد را وارد کنید" }),
  });

export const registerFormSchema = () =>
  z.object({
    // id: z.string(),
    first_name: z
      .string()
      .min(1, { message: "لطفا اسم را وارد کنید" })
      .max(125, { message: "نام ورودی بیش از حد مجاز است" }),
    last_name: z
      .string()
      .min(1, { message: "لطفا نام خانوادگی را وارد کنید" })
      .max(125, { message: "نام ورودی بیش از حد مجاز است" }),
    school: z
      .string()
      .min(1, { message: "لطفا نام مدرسه را وارد کنید" })
      .max(125, { message: "نام ورودی بیش از حد مجاز است" }),
    phone_number: z
      .string()
      .min(11, { message: "شماره نا معتبر است" })
      .max(13, { message: "شماره ورودی بیش از حد مجاز است" }),
    home_phone: z
      .string()
      .min(1, { message: "شماره نا معتبر است" })
      .max(13, { message: "شماره ورودی بیش از حد مجاز است" }),
    parent_phone: z
      .string()
      .min(11, { message: "شماره نا معتبر است" })
      .max(13, { message: "شماره ورودی بیش از حد مجاز است" }),
    field: z.string().min(1, { message: "رشته‌ی تحصیلی را انتخاب کنید" }),
    grade: z.string().min(1, { message: "مقطع تحصیلی را انتخاب کنید" }),
    date_of_birth: z.string().min(1, { message: "تاریخ تولد را وارد کنید" }),
    created: z.string(),
  });

export const registerAdvisorFormSchema = () =>
  z.object({
    id: z.string(),
    first_name: z
      .string()
      .min(1, { message: "لطفا اسم را وارد کنید" })
      .max(125, { message: "نام ورودی بیش از حد مجاز است" }),
    last_name: z
      .string()
      .min(1, { message: "لطفا نام مدرسه را وارد کنید" })
      .max(125, { message: "نام ورودی بیش از حد مجاز است" }),
    field: z.string().min(1, { message: "رشته‌ی تحصیلی را انتخاب کنید" }),
    phone_number: z
      .string()
      .min(11, { message: "شماره نا معتبر است" })
      .max(13, { message: "شماره ورودی بیش از حد مجاز است" }),
    national_id: z.string().min(1, { message: "کد نا معتبر است" }).max(10, { message: "کد ورودی بیش از حد مجاز است" }),
    bank_account: z.string(),
  });
