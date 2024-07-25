import { UseFormReturn } from "react-hook-form";
import SelectCustom from "./SelectCustom";
import { IEditAdvisorStudents } from "../../interface";

const FieldGrade = ({ form }: { form: UseFormReturn<IEditAdvisorStudents, undefined> }) => {
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
          { value: "0", label: "فارغ‌التحصیل" },
        ]}
      />
    </div>
  );
};

export default FieldGrade;
