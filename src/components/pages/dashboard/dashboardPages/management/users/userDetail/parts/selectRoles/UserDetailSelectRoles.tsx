import showToast from "@/components/ui/toast";
import { remove_user_roles, submit_user_roles } from "@/lib/apis/users/service";
import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";

interface RoleOption {
  value: string;
  label: string;
}

interface UserDetailSelectRolesProps {
  userId: number | null;
  initialRoles: number[]; // Prop for initial roles as an array of numbers
}

const UserDetailSelectRoles = ({
  userId,
  initialRoles,
}: UserDetailSelectRolesProps) => {
  // Convert initial roles to strings for the Select component
  const initialRoleValues = initialRoles.map(String);

  // Use useState to manage role selection independently
  const [selectedRoles, setSelectedRoles] =
    useState<string[]>(initialRoleValues);

  const roles: RoleOption[] = [
    { value: "0", label: "مدیرکل" },
    { value: "1", label: "واحد رزرو" },
    { value: "2", label: "واحد مشاوران" },
    { value: "3", label: "واحد حسابداری" },
    { value: "4", label: "واحد نظارت" },
    { value: "5", label: "واحد کنسلی" },
    { value: "6", label: "واحد محتوا" },
    { value: "7", label: "مشاور" },
    { value: "8", label: "واحد آزمون" },
  ];

  useEffect(() => {
    // Update the selected roles when the initial roles change
    setSelectedRoles(initialRoleValues);
  }, [initialRoles]);

  const handleRoleChange = async (selectedOptions: MultiValue<RoleOption>) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    // Determine if a role was added or removed
    const newRole = selectedValues.find((val) => !selectedRoles.includes(val));
    const removedRole = selectedRoles.find(
      (val) => !selectedValues.includes(val)
    );

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

        setSelectedRoles(selectedValues); // Update the local state
      } catch (error) {
        showToast.error("خطا در تغییر نقش کاربر، لطفا دوباره تلاش کنید");
        console.error("Error:", error);
      }
    } else {
      setSelectedRoles(selectedValues); // Update the local state
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <p className="font-semibold text-red-600">
        دقت داشته باشید با انتخاب هر یک از نقش های کاربر، در لحظه انتخاب اعمال
        میشود و درصورت حذف آن در لحظه نقش کاربر حذف میگردد!&ensp;
        <span className="font-bold text-sm text-slate-500">
          ( انتخاب نوع کاربر مشاور حتما باید در واحد مشاوران ثبت گردد)
        </span>
      </p>
      <Select
        isMulti
        value={roles.filter((role) => selectedRoles.includes(role.value))}
        onChange={handleRoleChange}
        placeholder="انتخاب نوع کاربر"
        options={roles}
        className="w-full"
      />
    </div>
  );
};

export default UserDetailSelectRoles;
