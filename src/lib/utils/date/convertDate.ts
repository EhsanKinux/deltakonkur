import jalaali from "jalaali-js";

export const convertToShamsi = (isoDate: string) => {
  const date = new Date(isoDate);
  const gregorianDate = {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  };

  const shamsiDate = jalaali.toJalaali(
    gregorianDate.gy,
    gregorianDate.gm,
    gregorianDate.gd
  );

  return `${shamsiDate.jd} / ${shamsiDate.jm} / ${shamsiDate.jy}`;
};

export const convertToShamsi2 = (isoDate: string) => {
  const date = new Date(isoDate);
  const gregorianDate = {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  };

  const shamsiDate = jalaali.toJalaali(
    gregorianDate.gy,
    gregorianDate.gm,
    gregorianDate.gd
  );

  const paddedMonth = String(shamsiDate.jm).padStart(2, '0');
  const paddedDay = String(shamsiDate.jd).padStart(2, '0');

  return `${shamsiDate.jy}-${paddedMonth}-${paddedDay}`;
};

export const convertToGregorian = (shamsiDate: string) => {
  const [jy, jm, jd] = shamsiDate.split("-").map(Number);
  console.log(shamsiDate);
  const gregorianDate = jalaali.toGregorian(jy, jm, jd);

  const date = new Date(
    gregorianDate.gy,
    gregorianDate.gm - 1,
    gregorianDate.gd + 1
  );
  return date.toISOString().split("T")[0];
};
