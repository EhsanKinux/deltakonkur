import { z } from "zod";

export const authFormSchema = () =>
  z.object({
    tell: z.string().min(8, { message: "حداقل 8 کاراکتر باید وارد شود" }),
    password: z.string().min(8, { message: "حداقل 8 کاراکتر باید وارد شود" }),
  });

export const contentFormSchema = () =>
  z.record(
    z.object({
      advisor: z.string().min(1, { message: "حداقل یک مشاور باید انتخاب کنید" }),
      subject: z.string().min(1, { message: "حداقل یک موضوع باید بنویسید" }),
    })
  );

export const updateUserFormSchema = () =>
  z.object({
    id: z.string(),
    first_name: z.string().min(1, { message: "لطفا نام را وارد کنید" }),
    last_name: z.string().min(1, { message: "لطفا نام خانوادگی را وارد کنید" }),
    national_id: z.string().min(1, { message: "کد ملی وارد نشده است" }),
    phone_number: z.string().min(1, { message: "شماره تلفن را وارد کنید" }),
    role: z.string().min(1, { message: "نوع کاربر را مشخص کنید" }),
  });

export const registerUserFormSchema = () =>
  z.object({
    // id: ;
    first_name: z.string().min(1, { message: "لطفا نام را وارد کنید" }),
    last_name: z.string().min(1, { message: "لطفا نام خانوادگی را وارد کنید" }),
    national_id: z.string().min(1, { message: "کد ملی وارد نشده است" }),
    phone_number: z.string().min(1, { message: "شماره تلفن را وارد کنید" }),
    role: z.string().min(1, { message: "نوع کاربر را مشخص کنید" }),
  });

export const studentAssessment = () =>
  z.object({
    // id: z.string(),
    student: z.string(),
    plan_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
    report_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
    phone_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
    advisor_behaviour_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
    followup_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
    motivation_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
    exam_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
    advisor_score: z.string().min(1, { message: "این فیلد نمیتواند خالی باشد" }),
  });

export const editAdvisorFormSchema = () =>
  z.object({
    id: z.string(),
    first_name: z.string().min(1, { message: "سطح مشاور را تعیین کنید" }),
    last_name: z.string().min(1, { message: "سطح مشاور را تعیین کنید" }),
    phone_number: z.string(),
    field: z.string().min(1, { message: "سطح مشاور را تعیین کنید" }),
    bank_account: z.string().min(1, { message: "سطح مشاور را تعیین کنید" }),
    national_id: z.string(),
    level: z.string().min(1, { message: "سطح مشاور را تعیین کنید" }),
  });

export const editStudentFormSchema = () =>
  z.object({
    // id: z.string(),
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
    package_price: z.string().min(1, { message: "هزینه را به ریال وارد کنید" }),
    solar_date_day: z.string(),
    solar_date_month: z.string(),
    solar_date_year: z.string(),
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
      .min(8, { message: "شماره نا معتبر است" })
      .max(13, { message: "شماره ورودی بیش از حد مجاز است" }),
    national_id: z.string().min(1, { message: "کد نا معتبر است" }).max(10, { message: "کد ورودی بیش از حد مجاز است" }),
    bank_account: z.string(),
    level: z.string().min(1, { message: "سطح مشاور را انتخاب کنید" }),
  });
