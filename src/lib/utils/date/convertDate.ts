import moment from "moment-jalaali";

/**
 * تبدیل تاریخ میلادی به شمسی با فرمت "روز / ماه / سال"
 * @param isoDate - تاریخ میلادی به صورت ISO string
 * @returns تاریخ شمسی با فرمت "روز / ماه / سال"
 */
export const convertToShamsi = (isoDate: string): string => {
  const jMoment = moment(isoDate);
  return jMoment.format("jD / jM / jYYYY");
};

/**
 * تبدیل تاریخ میلادی به شمسی با فرمت ISO (YYYY-MM-DD)
 * @param isoDate - تاریخ میلادی به صورت ISO string
 * @returns تاریخ شمسی با فرمت "YYYY-MM-DD"
 */
export const convertToShamsi2 = (isoDate: string): string => {
  const jMoment = moment(isoDate);
  return jMoment.format("jYYYY-jMM-jDD");
};

/**
 * تبدیل تاریخ شمسی به میلادی
 * @param shamsiDate - تاریخ شمسی با فرمت "YYYY-MM-DD"
 * @returns تاریخ میلادی با فرمت "YYYY-MM-DD"
 */
export const convertToGregorian = (shamsiDate: string): string => {
  const jMoment = moment(shamsiDate, "jYYYY-jMM-jDD");
  return jMoment.format("YYYY-MM-DD");
};

/**
 * تبدیل تاریخ میلادی به شمسی با فرمت کامل فارسی
 * @param isoDate - تاریخ میلادی به صورت ISO string
 * @returns تاریخ شمسی با فرمت کامل فارسی
 */
export const convertToShamsiFull = (isoDate: string): string => {
  const jMoment = moment(isoDate);
  return jMoment.format("jD jMMMM jYYYY");
};

/**
 * تبدیل تاریخ میلادی به شمسی با فرمت کوتاه
 * @param isoDate - تاریخ میلادی به صورت ISO string
 * @returns تاریخ شمسی با فرمت کوتاه
 */
export const convertToShamsiShort = (isoDate: string): string => {
  const jMoment = moment(isoDate);
  return jMoment.format("jYYYY/jMM/jDD");
};

/**
 * تبدیل تاریخ میلادی به شمسی با زمان
 * @param isoDate - تاریخ میلادی به صورت ISO string
 * @returns تاریخ و زمان شمسی
 */
export const convertToShamsiWithTime = (isoDate: string): string => {
  const jMoment = moment(isoDate);
  return jMoment.format("jYYYY/jMM/jDD HH:mm");
};

/**
 * بررسی معتبر بودن تاریخ شمسی
 * @param shamsiDate - تاریخ شمسی
 * @returns true اگر تاریخ معتبر باشد
 */
export const isValidShamsiDate = (shamsiDate: string): boolean => {
  return moment(shamsiDate, "jYYYY-jMM-jDD", true).isValid();
};

/**
 * دریافت تاریخ امروز به شمسی
 * @returns تاریخ امروز به شمسی
 */
export const getTodayShamsi = (): string => {
  return moment().format("jYYYY-jMM-jDD");
};

/**
 * تبدیل تاریخ میلادی به شمسی با قابلیت تنظیم فرمت
 * @param isoDate - تاریخ میلادی
 * @param format - فرمت مورد نظر
 * @returns تاریخ شمسی با فرمت مشخص شده
 */
export const convertToShamsiCustom = (
  isoDate: string,
  format: string
): string => {
  const jMoment = moment(isoDate);
  return jMoment.format(format);
};
