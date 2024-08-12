export const getRoleNames = (roles: number[]): string => {
  const roleMap: { [key: number]: string } = {
    0: "مدیرکل",
    1: "واحد رزرو",
    2: "واحد مشاوران",
    3: "واحد حسابداری",
    4: "واحد نظارت",
    5: "واحد کنسلی",
    6: "واحد محتوا",
    7: "مشاور",
  };

  return roles.map((role) => roleMap[role] || "نامشخص").join(", ");
};
