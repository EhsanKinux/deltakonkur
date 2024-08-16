import { ColumnDef } from "@tanstack/react-table";
import { IStudentAssessment } from "../assess/interface";

export const stAssessmentColumnDef: ColumnDef<IStudentAssessment>[] = [
  {
    accessorKey: "advisor_name",
    header: "نام مشاور",
  },
  {
    accessorKey: "plan_score",
    header: "نمره برنامه‌ریزی ",
  },
  {
    accessorKey: "report_score",
    header: "نمره گزارش‌کار",
  },
  {
    accessorKey: "phone_score",
    header: "نمره تایم تماس تلفنی",
  },
  {
    accessorKey: "advisor_behaviour_score",
    header: "نمره برخورد مشاور",
  },
  {
    accessorKey: "followup_score",
    header: "نمره پیگیری و جدیت",
  },
  {
    accessorKey: "motivation_score",
    header: "نمره عملکرد انگیزشی",
  },
  {
    accessorKey: "exam_score",
    header: "تعداد آزمون برگزار شده ( از نظرسنجی قبل تا الان)",
  },
  {
    accessorKey: "advisor_score",
    header: "نمره کلی مشاور",
  },
  {
    accessorKey: "created",
    header: "تاریخ ثبت",
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;
  //       return <StudentDialogButtons formData={formData} />;
  //     },
  //   },
];
