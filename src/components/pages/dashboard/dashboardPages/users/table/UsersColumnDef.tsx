import { ColumnDef } from "@tanstack/react-table";
import { IUsers } from "../users/interface";

// import StudentDialogButtons from "./parts/StudentDialogButtons";

export const userColumns: ColumnDef<IUsers>[] = [
  {
    accessorKey: "first_name",
    header: "نام",
  },
  {
    accessorKey: "last_name",
    header: "نام خانوادگی",
  },
  {
    accessorKey: "phone_number",
    header: "شماره همراه",
  },
  {
    accessorKey: "national_id",
    header: "کد ملی",
  },
  {
    accessorKey: "role",
    header: "نوع کاربر",
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const formData = row.original;
  //       return <StudentDialogButtons formData={formData} />;
  //     },
  //   },
];
