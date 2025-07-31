export interface FormOption {
  value: string;
  label: string;
  description?: string;
}

export const FIELD_OPTIONS: FormOption[] = [
  {
    value: "ریاضی",
    label: "ریاضی",
    description: "رشته ریاضی و فیزیک",
  },
  {
    value: "تجربی",
    label: "تجربی",
    description: "رشته علوم تجربی",
  },
  {
    value: "علوم انسانی",
    label: "علوم انسانی",
    description: "رشته علوم انسانی",
  },
];

export const GRADE_OPTIONS: FormOption[] = [
  {
    value: "10",
    label: "پایه دهم",
    description: "سال اول دبیرستان",
  },
  {
    value: "11",
    label: "پایه یازدهم",
    description: "سال دوم دبیرستان",
  },
  {
    value: "12",
    label: "پایه دوازدهم",
    description: "سال سوم دبیرستان",
  },
  {
    value: "13",
    label: "فارغ‌التحصیل",
    description: "دانش‌آموز فارغ‌التحصیل",
  },
];

export const FORM_SECTIONS = {
  PERSONAL: {
    title: "اطلاعات شخصی",
    description: "نام، نام خانوادگی و نام مدرسه دانش‌آموز",
  },
  CONTACT: {
    title: "اطلاعات ارتباطی",
    description: "شماره تماس دانش‌آموز و والدین",
  },
  ACADEMIC: {
    title: "اطلاعات تحصیلی",
    description: "رشته و مقطع تحصیلی دانش‌آموز",
  },
  FINANCIAL: {
    title: "اطلاعات مالی",
    description: "هزینه بسته و مسئول فروش",
  },
} as const;

export const HELP_GUIDE = {
  title: "راهنمای تکمیل فرم",
  sections: [
    {
      title: "اطلاعات شخصی:",
      items: [
        "نام و نام خانوادگی باید به فارسی وارد شود",
        "نام مدرسه باید دقیق و کامل باشد",
      ],
    },
    {
      title: "اطلاعات ارتباطی:",
      items: [
        "شماره همراه باید با 09 شروع شود",
        "شماره تلفن منزل اختیاری است",
        "شماره والدین برای ارتباط ضروری است",
      ],
    },
    {
      title: "اطلاعات تحصیلی:",
      items: [
        "رشته تحصیلی را با دقت انتخاب کنید",
        "مقطع تحصیلی باید صحیح باشد",
      ],
    },
    {
      title: "اطلاعات مالی:",
      items: [
        "هزینه بسته را به ریال وارد کنید",
        "انتخاب مسئول فروش اختیاری است",
      ],
    },
  ],
} as const;
