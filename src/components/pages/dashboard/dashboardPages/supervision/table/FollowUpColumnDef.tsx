import { ColumnDef } from "@tanstack/react-table";
import { FormEntry } from "../../advisors/parts/student/table/interfaces";
import FollowUpDialogButtons from "../followUp/parts/FollowUpDialogButtons";

// import StudentDialogButtons from "./parts/StudentDialogButtons";

export const followUpStColumns: ColumnDef<FormEntry>[] = [
  {
    accessorKey: "first_name",
    header: "نام",
  },
  {
    accessorKey: "last_name",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "first_call",
    header: "تماس اول",
  },
  {
    accessorKey: "first_call_time",
    header: "زمان تماس اول",
  },
  {
    accessorKey: "second_call",
    header: "تماس دوم",
  },
  {
    accessorKey: "second_call_time",
    header: "زمان تماس دوم",
  },
  {
    accessorKey: "completed_time",
    header: "زمان تکمیل شدن",
  },
  {
    id: "actions",
    cell: () => {
    //   const formData = row.original;
      return <FollowUpDialogButtons />;
    },
  },
];
