import { UseFormReturn } from "react-hook-form";
import SelectCustom from "./SelectCustom";

const FieldGrade = ({
  form,
}: {
  form: UseFormReturn<
    {
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
    },
    undefined
  >;
}) => {
  const { register, setValue, watch } = form;
  const fieldValue = watch("field");
  const gradeValue = watch("grade");
  return (
    <div className="flex justify-center items-center gap-3 bg-slate-100 rounded-xl">
      <SelectCustom
        {...register("field")}
        value={fieldValue}
        onValueChange={(value: any) => setValue("field", value)}
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
        onValueChange={(value: any) => setValue("grade", value)}
        placeholder="مقطع تحصیلی"
        options={[
          { value: "10", label: "پایه دهم" },
          { value: "11", label: "پایه یازدهم" },
          { value: "12", label: "پایه دوازدهم" },
        ]}
      />
    </div>
  );
};

export default FieldGrade;
