export const VALIDATION_PATTERNS = {
  PHONE: /^09[0-9]{9}$/,
  NATIONAL_ID: /^[0-9]{10}$/,
  BANK_ACCOUNT: /^[0-9]{10,16}$/,
  PERSIAN_NAME: /^[\u0600-\u06FF\s]+$/,
} as const;

export const VALIDATION_MESSAGES = {
  PHONE: "شماره همراه باید با 09 شروع شود و 11 رقم باشد",
  NATIONAL_ID: "کد ملی باید 10 رقم باشد",
  NATIONAL_ID_INVALID: "کد ملی نامعتبر است",
  NATIONAL_ID_ALL_ZEROS: "کد ملی نمی‌تواند همه ارقام صفر باشد",
  NATIONAL_ID_INVALID_CHECK_DIGIT: "کد ملی نامعتبر است (رقم کنترل اشتباه)",
  BANK_ACCOUNT: "شماره حساب باید بین 10 تا 16 رقم باشد",
  PERSIAN_NAME: "نام باید به فارسی وارد شود",
  REQUIRED: "این فیلد الزامی است",
  MIN_LENGTH: (min: number) => `حداقل ${min} کاراکتر باید وارد شود`,
  MAX_LENGTH: (max: number) => `حداکثر ${max} کاراکتر مجاز است`,
} as const;

export const validatePhoneNumber = (value: string): string | true => {
  if (!value) return VALIDATION_MESSAGES.REQUIRED;
  if (!VALIDATION_PATTERNS.PHONE.test(value)) {
    return VALIDATION_MESSAGES.PHONE;
  }
  return true;
};

export const validateNationalId = (value: string): string | true => {
  if (!value) return VALIDATION_MESSAGES.REQUIRED;

  // Check if it's exactly 10 digits
  if (!VALIDATION_PATTERNS.NATIONAL_ID.test(value)) {
    return VALIDATION_MESSAGES.NATIONAL_ID;
  }

  // Check if all digits are zero (invalid)
  if (/^0{10}$/.test(value)) {
    return VALIDATION_MESSAGES.NATIONAL_ID_ALL_ZEROS;
  }

  // Iran National ID validation algorithm
  const digits = value.split("").map(Number);

  // Check digit validation
  const checkDigit = digits[9];
  let sum = 0;

  // Calculate weighted sum for first 9 digits
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  const remainder = sum % 11;
  let calculatedCheckDigit;

  if (remainder < 2) {
    calculatedCheckDigit = remainder;
  } else {
    calculatedCheckDigit = 11 - remainder;
  }

  if (checkDigit !== calculatedCheckDigit) {
    return VALIDATION_MESSAGES.NATIONAL_ID_INVALID_CHECK_DIGIT;
  }

  return true;
};

export const validateBankAccount = (value: string): string | true => {
  if (!value) return VALIDATION_MESSAGES.REQUIRED;
  if (!VALIDATION_PATTERNS.BANK_ACCOUNT.test(value)) {
    return VALIDATION_MESSAGES.BANK_ACCOUNT;
  }
  return true;
};

export const validatePersianName = (value: string): string | true => {
  if (!value) return VALIDATION_MESSAGES.REQUIRED;
  if (!VALIDATION_PATTERNS.PERSIAN_NAME.test(value)) {
    return VALIDATION_MESSAGES.PERSIAN_NAME;
  }
  return true;
};

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");

  // Ensure it starts with 09
  if (cleaned.length > 0 && !cleaned.startsWith("09")) {
    return "09" + cleaned.substring(0, 9);
  }

  // Limit to 11 digits
  return cleaned.substring(0, 11);
};

export const formatNationalId = (value: string): string => {
  // Remove all non-digit characters and limit to 10 digits
  return value.replace(/\D/g, "").substring(0, 10);
};

export const formatBankAccount = (value: string): string => {
  // Remove all non-digit characters and limit to 16 digits
  return value.replace(/\D/g, "").substring(0, 16);
};
