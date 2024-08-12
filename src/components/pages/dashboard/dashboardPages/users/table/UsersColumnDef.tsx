import { ColumnDef } from "@tanstack/react-table";
import UserDialogButton from "./delete/UserDialogButton";
import { IUsers2 } from "@/lib/store/useUsersStore";

// import StudentDialogButtons from "./parts/StudentDialogButtons";

export const userColumns: ColumnDef<IUsers2>[] = [
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
    accessorKey: "roles",
    header: "نوع کاربر",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const formData = row.original;
      return <UserDialogButton formData={formData} />;
    },
  },
];
