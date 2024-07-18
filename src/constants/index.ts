import reserveIcon from "@/assets/icons/reserve.svg";
import advisorIcon from "@/assets/icons/people.svg";
import advisorsListIcon from "@/assets/icons/advisorBag.svg";
import studentIcon from "@/assets/icons/studenHat.svg";
import accountingIcon from "@/assets/icons/calculator.svg";
import supervisorIcon from "@/assets/icons/task-square.svg";
import cancelingIcon from "@/assets/icons/profile-delete.svg";
import contentIcon from "@/assets/icons/document-text.svg";
import usersIcon from "@/assets/icons/profile-2user.svg";
import addSquareIcon from "@/assets/icons/addSquare.svg";

export const sidebarLinks = [
  {
    id: 1,
    imgURL: reserveIcon,
    route: "/dashboard/reserve",
    label: "رزرو",
  },
  {
    id: 2,
    imgURL: advisorIcon,
    route: "/dashboard/advisors",
    label: "مشاوران",
    children: [
      {
        id: 21,
        imgURL: addSquareIcon,
        route: "/dashboard/advisors/register",
        label: "افزودن مشاور جدید",
      },
      {
        id: 22,
        imgURL: advisorsListIcon,
        route: "/dashboard/advisors",
        label: "لیست مشاوران",
      },
      {
        id: 23,
        imgURL: studentIcon,
        route: "/dashboard/students",
        label: "لیست دانش آموزان",
      },
    ],
  },
  {
    id: 3,
    imgURL: accountingIcon,
    route: "/dashboard/accounting",
    label: "حسابداری",
    children: [
      {
        id: 31,
        imgURL: advisorsListIcon,
        route: "/dashboard/accounting/allAdvisors",
        label: "تمام مشاوران",
      },
      {
        id: 32,
        imgURL: studentIcon,
        route: "/dashboard/accounting/allStudents",
        label: "تمام دانش آموزان",
      },
    ],
  },
  {
    id: 4,
    imgURL: supervisorIcon,
    route: "/dashboard/supervision",
    label: "نظارت",
  },
  {
    id: 5,
    imgURL: cancelingIcon,
    route: "/dashboard/canceling",
    label: "کنسلی",
  },
  {
    id: 6,
    imgURL: contentIcon,
    route: "/dashboard/content",
    label: "محتوا",
  },
  {
    id: 7,
    imgURL: usersIcon,
    route: "/dashboard/users",
    label: "کاربران",
    children: [
      {
        id: 71,
        imgURL: addSquareIcon,
        route: "/dashboard/users/register",
        label: "ثبت کاربر جدید",
      },
      {
        id: 72,
        imgURL: usersIcon,
        route: "/dashboard/users",
        label: "کاربران",
      },
    ],
  },
];
