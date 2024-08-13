import { IStudentAssessment } from "@/components/pages/dashboard/dashboardPages/supervision/assess/interface";
import { ColumnDef } from "@tanstack/react-table";

export const advisorAssessmentColumnDef: ColumnDef<IStudentAssessment>[] = [
  {
    accessorKey: "student_name",
    header: "نام دانش‌آموز",
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
    header: "نمره آزمون",
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
