import { useController, UseFormReturn } from "react-hook-form";
import CustomRoleSelect from "./CustomRoleSelect";

const UserDetailSelectRoles = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
      first_name: string;
      last_name: string;
      national_id: string;
      phone_number: string;
      role: string;
    },
    undefined
  >;
}) => {
  const { control } = form;

  const {
    field: { onChange, value },
  } = useController({
    name: "role",
    control,
    defaultValue: "",
  });

  const roles = [
    { value: "0", label: "مدیرکل" },
    { value: "1", label: "واحد رزرو" },
    { value: "2", label: "واحد مشاوران" },
    { value: "3", label: "واحد حسابداری" },
    { value: "4", label: "واحد نظارت" },
    { value: "5", label: "واحد کنسلی" },
    { value: "6", label: "واحد محتوا" },
    // { value: "7", label: "مشاور" },
  ];

  return (
    <div className="flex justify-center items-center">
      <CustomRoleSelect
        value={value}
        onValueChange={(value: string) => onChange(value)}
        placeholder="انتخاب نوع کاربر"
        options={roles}
      />
    </div>
  );
};

export default UserDetailSelectRoles;
