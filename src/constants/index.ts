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
import sendMessageIcon from "@/assets/icons/sendmsg.svg";
import followUpIcon from "@/assets/icons/followup.svg";
import supervisionIcon from "@/assets/icons/box-search.svg";
import examIcon from "@/assets/icons/note.svg";

export const sidebarLinks = [
  {
    id: 1,
    imgURL: reserveIcon,
    route: "/dashboard/reserve",
    label: "رزرو",
    roles: [0, 1],
  },
  {
    id: 2,
    imgURL: advisorIcon,
    route: "/dashboard/advisors",
    label: "مشاوران",
    roles: [0, 2],
    children: [
      {
        id: 21,
        imgURL: addSquareIcon,
        route: "/dashboard/advisors/register",
        label: "افزودن مشاور جدید",
        roles: [0, 2],
      },
      {
        id: 22,
        imgURL: advisorsListIcon,
        route: "/dashboard/advisors",
        label: "لیست مشاوران",
        roles: [0, 2],
      },
      {
        id: 23,
        imgURL: studentIcon,
        route: "/dashboard/students",
        label: "لیست دانش آموزان",
        roles: [0, 2],
      },
    ],
  },
  {
    id: 3,
    imgURL: accountingIcon,
    route: "/dashboard/accounting",
    label: "حسابداری",
    roles: [0, 3],
    children: [
      {
        id: 31,
        imgURL: advisorsListIcon,
        route: "/dashboard/accounting/allAdvisors",
        label: "تمام مشاوران",
        roles: [0, 3],
      },
      {
        id: 32,
        imgURL: studentIcon,
        route: "/dashboard/accounting/allStudents",
        label: "تمام دانش آموزان",
        roles: [0, 3],
      },
    ],
  },
  {
    id: 4,
    imgURL: supervisorIcon,
    route: "/dashboard/supervision",
    label: "نظارت",
    roles: [0, 4],
    children: [
      {
        id: 41,
        imgURL: supervisionIcon,
        route: "/dashboard/supervision",
        label: "نظارت",
        roles: [0, 4],
      },
      {
        id: 42,
        imgURL: followUpIcon,
        route: "/dashboard/supervision/followup",
        label: "پیگیری",
        roles: [0, 4],
      },
    ],
  },
  {
    id: 5,
    imgURL: cancelingIcon,
    route: "/dashboard/canceling",
    label: "کنسلی",
    roles: [0, 5],
  },
  {
    id: 6,
    imgURL: contentIcon,
    route: "/dashboard/content",
    label: "محتوا",
    roles: [0, 6],
    children: [
      {
        id: 61,
        imgURL: advisorsListIcon,
        route: "/dashboard/content/advisors",
        label: "مشاوران",
        roles: [0, 6],
      },
      {
        id: 62,
        imgURL: sendMessageIcon,
        route: "/dashboard/content/sendMessage",
        label: "ارسال پیام",
        roles: [0, 6],
      },
    ],
  },
  {
    id: 7,
    imgURL: usersIcon,
    route: "/dashboard/users",
    label: "کاربران",
    roles: [0],
    children: [
      {
        id: 71,
        imgURL: addSquareIcon,
        route: "/dashboard/users/register",
        label: "ثبت کاربر جدید",
        roles: [0],
      },
      {
        id: 72,
        imgURL: usersIcon,
        route: "/dashboard/users",
        label: "کاربران",
        roles: [0],
      },
    ],
  },
  {
    id: 8,
    imgURL: advisorsListIcon,
    route: "/dashboard/advisors/justAdvisor",
    label: "مشاور",
    roles: [7],
  },
  {
    id: 9,
    imgURL: examIcon,
    route: "/dashboard/exam",
    label: "آزمون",
    roles: [0],
  },
];
