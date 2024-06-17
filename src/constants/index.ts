import reserveIcon from "@/assets/icons/reserve.svg";
import advisorIcon from "@/assets/icons/people.svg";
import accountingIcon from "@/assets/icons/calculator.svg";
import supervisorIcon from "@/assets/icons/task-square.svg";
import cancelingIcon from "@/assets/icons/profile-delete.svg";
import contentIcon from "@/assets/icons/document-text.svg";
import usersIcon from "@/assets/icons/profile-2user.svg";
import listIcon from "@/assets/icons/List.svg";
import addSquareIcon from "@/assets/icons/addSquare.svg"

export const sidebarLinks = [
  {
    imgURL: reserveIcon,
    route: "/dashboard/reserve",
    label: "رزرو",
  },
  {
    imgURL: advisorIcon,
    route: "/dashboard/advisors",
    label: "مشاوران",
    children:[
      {
        imgURL: addSquareIcon,
        route: "/dashboard/advisors/register",
        label: "افزودن مشاور جدید",
      },{
        imgURL: listIcon,
        route: "/dashboard/advisors",
        label: "لیست مشاوران",
      },{
        imgURL: listIcon,
        route: "/dashboard/students",
        label: "لیست دانش آموزان",
      },
    ]
  },
  {
    imgURL: accountingIcon,
    route: "/dashboard/accounting",
    label: "حسابداری",
  },
  {
    imgURL: supervisorIcon,
    route: "/dashboard/supervision",
    label: "نظارت",
  },
  {
    imgURL: cancelingIcon,
    route: "/dashboard/canceling",
    label: "کنسلی",
  },
  {
    imgURL: contentIcon,
    route: "/dashboard/content",
    label: "محتوا",
  },
  {
    imgURL: usersIcon,
    route: "/dashboard/users",
    label: "کاربران",
  },
];
