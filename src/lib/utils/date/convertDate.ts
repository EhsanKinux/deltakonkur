import jalaali from "jalaali-js";

export const convertToShamsi = (isoDate: string) => {
  const date = new Date(isoDate);
  const gregorianDate = {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  };

  const shamsiDate = jalaali.toJalaali(gregorianDate.gy, gregorianDate.gm, gregorianDate.gd);

  return `${shamsiDate.jd} / ${shamsiDate.jm} / ${shamsiDate.jy}`;
};

export const convertToShamsi2 = (isoDate: string) => {
  const date = new Date(isoDate);
  const gregorianDate = {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  };

  const shamsiDate = jalaali.toJalaali(gregorianDate.gy, gregorianDate.gm, gregorianDate.gd);

  return `${shamsiDate.jy}-${shamsiDate.jm}-${shamsiDate.jd}`;
};

export const convertToGregorian = (shamsiDate: string) => {
  const [jy, jm, jd] = shamsiDate.split("-").map(Number);
  const gregorianDate = jalaali.toGregorian(jy, jm, jd);

  const date = new Date(gregorianDate.gy, gregorianDate.gm - 2, gregorianDate.gd);
  return date.toISOString().split("T")[0];
};
