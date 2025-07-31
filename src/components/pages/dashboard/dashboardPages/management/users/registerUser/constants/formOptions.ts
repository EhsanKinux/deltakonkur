export interface FormOption {
  value: string;
  label: string;
  description?: string;
}

export const ROLE_OPTIONS: FormOption[] = [
  {
    value: "0",
    label: "مدیرکل",
    description: "دسترسی کامل به تمام بخش‌های سیستم",
  },
  {
    value: "1",
    label: "واحد رزرو",
    description: "مدیریت ثبت‌نام دانش‌آموزان",
  },
  {
    value: "2",
    label: "واحد مشاوران",
    description: "مدیریت مشاوران و دانش‌آموزان",
  },
  {
    value: "3",
    label: "واحد حسابداری",
    description: "مدیریت مالی و حسابداری",
  },
  {
    value: "4",
    label: "واحد نظارت",
    description: "نظارت بر عملکرد مشاوران",
  },
  {
    value: "5",
    label: "واحد کنسلی",
    description: "مدیریت کنسلی و انصراف",
  },
  {
    value: "6",
    label: "واحد محتوا",
    description: "مدیریت محتوای آموزشی",
  },
  {
    value: "8",
    label: "واحد آزمون",
    description: "مدیریت آزمون‌ها",
  },
];

export const FORM_SECTIONS = {
  PERSONAL: {
    title: "اطلاعات شخصی",
    description: "نام، نام خانوادگی و کد ملی کاربر",
  },
  CONTACT: {
    title: "اطلاعات ارتباطی",
    description: "شماره تماس کاربر",
  },
  ROLES: {
    title: "نقش‌های کاربری",
    description: "انتخاب نقش‌های مناسب برای کاربر",
  },
} as const;

export const HELP_GUIDE = {
  title: "راهنمای تکمیل فرم",
  sections: [
    {
      title: "اطلاعات شخصی:",
      items: [
        "نام و نام خانوادگی باید به فارسی وارد شود",
        "کد ملی باید 10 رقم باشد",
        "اطلاعات باید دقیق و صحیح باشند",
      ],
    },
    {
      title: "اطلاعات ارتباطی:",
      items: [
        "شماره همراه باید با 09 شروع شود",
        "شماره تلفن باید معتبر باشد",
        "این شماره برای ارتباط ضروری است",
      ],
    },
    {
      title: "نقش‌های کاربری:",
      items: [
        "حداقل یک نقش باید انتخاب شود",
        "نقش‌ها بر اساس نیاز کاربر تعیین شوند",
        "می‌توانید چندین نقش همزمان انتخاب کنید",
      ],
    },
  ],
} as const;
