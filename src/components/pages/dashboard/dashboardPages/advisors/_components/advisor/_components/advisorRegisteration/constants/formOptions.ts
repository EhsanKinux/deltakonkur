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

export const LEVEL_OPTIONS: FormOption[] = [
  {
    value: "1",
    label: "سطح 1",
    description: "مشاور تازه کار",
  },
  {
    value: "2",
    label: "سطح 2",
    description: "مشاور با تجربه",
  },
  {
    value: "3",
    label: "سطح 3",
    description: "مشاور ارشد",
  },
  {
    value: "4",
    label: "ارشد 1",
    description: "مشاور ارشد سطح 1",
  },
  {
    value: "5",
    label: "ارشد 2",
    description: "مشاور ارشد سطح 2",
  },
];

export const FORM_SECTIONS = {
  PERSONAL: {
    title: "اطلاعات شخصی",
    description: "نام، نام خانوادگی و اطلاعات تماس مشاور",
  },
  ACADEMIC: {
    title: "اطلاعات تحصیلی",
    description: "رشته تحصیلی و سطح تخصص مشاور",
  },
  FINANCIAL: {
    title: "اطلاعات مالی",
    description: "کد ملی و شماره حساب بانکی",
  },
} as const;

export const HELP_GUIDE = {
  title: "راهنمای تکمیل فرم",
  sections: [
    {
      title: "اطلاعات شخصی:",
      items: [
        "نام و نام خانوادگی باید به فارسی وارد شود",
        "شماره همراه باید با 09 شروع شود",
      ],
    },
    {
      title: "اطلاعات مالی:",
      items: ["کد ملی باید 10 رقم باشد", "شماره حساب باید معتبر باشد"],
    },
  ],
} as const;
