import { UseFormReturn } from "react-hook-form";
import SelectCustom from "./SelectCustom";

const FieldGrade = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
      // date_of_birth: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created: string;
      advisor: string;
      package_price: string;
    },
    undefined
  >;
}) => {
  const { register, setValue, watch } = form;
  const fieldValue = watch("field");
  const gradeValue = watch("grade");

  return (
    <div className="flex justify-center items-center !gap-2 bg-slate-100 rounded-xl">
      <SelectCustom
        {...register("field")}
        value={fieldValue}
        onValueChange={(value: string) => setValue("field", value)}
        placeholder="رشته تحصیلی"
        options={[
          { value: "ریاضی", label: "ریاضی" },
          { value: "تجربی", label: "تجربی" },
          { value: "علوم انسانی", label: "علوم انسانی" },
        ]}
      />
      <SelectCustom
        {...register("grade")}
        value={gradeValue}
        onValueChange={(value: string) => setValue("grade", value)}
        placeholder="مقطع تحصیلی"
        options={[
          { value: "10", label: "پایه دهم" },
          { value: "11", label: "پایه یازدهم" },
          { value: "12", label: "پایه دوازدهم" },
          { value: "13", label: "فارغ‌التحصیل" },
        ]}
      />
    </div>
  );
};

export default FieldGrade;
