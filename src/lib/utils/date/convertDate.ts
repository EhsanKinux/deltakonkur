import jalaali from "jalaali-js";

export const convertToShamsi = (isoDate: string) => {
  const date = new Date(isoDate);
  const gregorianDate = {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  };

  const shamsiDate = jalaali.toJalaali(gregorianDate.gy, gregorianDate.gm, gregorianDate.gd);

  return `${shamsiDate.jy}-${shamsiDate.jm}-${shamsiDate.jd}`;
};

export const convertToShamsi2 = (isoDate: string) => {
  const date = new Date(isoDate);
  const gregorianDate = {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  };

  const shamsiDate = jalaali.toJalaali(gregorianDate.gy, gregorianDate.gm, gregorianDate.gd);

  return `${shamsiDate.jy}${shamsiDate.jm.toString().padStart(2, "0")}${shamsiDate.jd.toString().padStart(2, "0")}`;
};

export const convertToIso = (shamsiDate: string) => {
  const jy = parseInt(shamsiDate.substring(0, 4));
  const jm = parseInt(shamsiDate.substring(4, 6));
  const jd = parseInt(shamsiDate.substring(6, 8));

  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);

  // Get the current time
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const milliseconds = now.getMilliseconds().toString().padStart(3, "0");

  const isoDate = new Date(
    gy,
    gm - 1,
    gd,
    Number(hours),
    Number(minutes),
    Number(seconds),
    Number(milliseconds)
  ).toISOString();

  return isoDate;
};
