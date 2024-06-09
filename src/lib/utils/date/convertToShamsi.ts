import jalaali from 'jalaali-js'

export const convertToShamsi = (isoDate) => {
  const date = new Date(isoDate);
  const gregorianDate = {
    gy: date.getFullYear(),
    gm: date.getMonth() + 1,
    gd: date.getDate(),
  };

  const shamsiDate = jalaali.toJalaali(gregorianDate.gy, gregorianDate.gm, gregorianDate.gd);

  return `${shamsiDate.jy}-${shamsiDate.jm}-${shamsiDate.jd}`;
};


