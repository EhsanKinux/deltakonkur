import showToast from "@/components/ui/toast";
import { remove_user_roles, submit_user_roles } from "@/lib/apis/users/service";
import { useController, UseFormReturn } from "react-hook-form";
import Select, { MultiValue } from "react-select";

interface RoleOption {
  value: string;
  label: string;
}

// Define the props for SelectRoles component
interface SelectRolesProps {
  form: UseFormReturn<{ roles: string[] }>;
  userId: number | null;
}

const SelectRoles = ({ form, userId }: SelectRolesProps) => {
  const {
    field: { onChange, value },
  } = useController({
    name: "roles",
    control: form.control,
    defaultValue: [], // Default value as an empty array
  });

  const roles: RoleOption[] = [
    { value: "0", label: "مدیرکل" },
    { value: "1", label: "واحد رزرو" },
    { value: "2", label: "واحد مشاوران" },
    { value: "3", label: "واحد حسابداری" },
    { value: "4", label: "واحد نظارت" },
    { value: "5", label: "واحد کنسلی" },
    { value: "6", label: "واحد محتوا" },
    { value: "8", label: "واحد آزمون" },
  ];

  const handleRoleChange = async (selectedOptions: MultiValue<RoleOption>) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    // Determine if a role was added or removed
    const newRole = selectedValues.find((val) => !value.includes(val));
    const removedRole = value.find((val) => !selectedValues.includes(val));

    if (userId !== null) {
      try {
        if (newRole) {
          // Add the new role
          const response = await submit_user_roles({
            userId,
            body: {
              role: Number(newRole),
            },
          });

          if (response) {
            showToast.success("نقش کاربر با موفقیت ثبت شد");
          }
        }

        if (removedRole) {
          // Remove the removed role
          const response = await remove_user_roles({
            userId,
            body: {
              role: Number(removedRole),
            },
          });

          if (response) {
            showToast.success("نقش کاربر با موفقیت حذف شد");
          }
        }

        onChange(selectedValues); // Update the form value
      } catch (error) {
        showToast.error("خطا در تغییر نقش کاربر، لطفا دوباره تلاش کنید");
        console.error("Error:", error);
      }
    } else {
      onChange(selectedValues); // Update the form value
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <p className="font-semibold text-red-600">
        دقت داشته باشید با انتخاب هر یک از نقش های کاربر، در لحظه انتخاب اعمال
        میشود و درصورت حذف آن در لحظه نقش کاربر حذف میگردد!
      </p>
      <Select
        isMulti
        value={roles.filter((role) => value.includes(role.value))}
        onChange={handleRoleChange} // Corrected the parameter types
        placeholder="انتخاب نوع کاربر"
        options={roles}
        className="w-full"
      />
    </div>
  );
};
export default SelectRoles;
