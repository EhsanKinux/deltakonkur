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
import followUpIcon from "@/assets/icons/followup.svg";
import supervisionIcon from "@/assets/icons/box-search.svg";
import examIcon from "@/assets/icons/note.svg";
import financeIcon from "@/assets/icons/financeReport.svg";
import managementIcon from "@/assets/icons/managementIcon.svg";

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
      {
        id: 33,
        imgURL: financeIcon,
        route: "/dashboard/accounting/monthlyFinancialSummary",
        label: "حساب کتاب ماهیانه",
        roles: [0, 3],
      },
    ],
  },
  {
    id: 10,
    imgURL: managementIcon,
    route: "/dashboard/management",
    label: "مدیریت",
    roles: [0],
    children: [
      {
        id: 100,
        imgURL: usersIcon,
        route: "/dashboard/management/sales-managers",
        label: "مسئولان فروش",
        roles: [0],
      },

      {
        id: 101,
        imgURL: addSquareIcon,
        route: "/dashboard/management/users/register",
        label: "افزودن کاربر جدید",
        roles: [0],
      },
      {
        id: 102,
        imgURL: usersIcon,
        route: "/dashboard/management/users",
        label: "لیست کاربران",
        roles: [0],
      },
      {
        id: 103,
        imgURL: supervisorIcon,
        route: "/dashboard/management/supervisors",
        label: "لیست ناظران",
        roles: [0],
      },
      {
        id: 104,
        imgURL: financeIcon,
        route: "/dashboard/management/reports",
        label: "گزارش گیری",
        roles: [0],
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
    route: "/dashboard/content/list",
    label: "محتوا",
    roles: [0, 6],
  },
  {
    id: 7,
    imgURL: advisorsListIcon,
    route: "/dashboard/advisors/justAdvisor",
    label: "مشاور",
    roles: [7],
  },
  {
    id: 8,
    imgURL: examIcon,
    route: "/dashboard/exam",
    label: "آزمون",
    roles: [0, 8],
  },
];
