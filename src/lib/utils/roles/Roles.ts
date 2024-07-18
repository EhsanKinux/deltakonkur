export const getRoleName = (role: string): string => {
  const roleMap: { [key: string]: string } = {
    0: "مدیرکل",
    1: "واحد رزرو",
    2: "واحد مشاوران",
    3: "واحد حسابداری",
    4: "واحد نظارت",
    5: "واحد کنسلی",
    6: "واحد محتوا",
    7: "مشاور",
  };
  return roleMap[role] || "Unknown Role";
};
