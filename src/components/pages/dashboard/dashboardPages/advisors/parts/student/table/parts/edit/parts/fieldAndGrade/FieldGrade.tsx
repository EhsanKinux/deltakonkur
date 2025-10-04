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
      supervisor: string;
      package_price: string;
      plan: string;
      solar_date_day: string;
      solar_date_month: string;
      solar_date_year: string;
      supervisor_solar_date_day: string;
      supervisor_solar_date_month: string;
      supervisor_solar_date_year: string;
    },
    undefined
  >;
}) => {
  const { register, setValue, watch } = form;
  const fieldValue = watch("field");
  const gradeValue = watch("grade");
  const planValue = watch("plan");

  return (
    <div className="flex flex-col gap-4 bg-slate-100 rounded-xl">
      <div className="flex justify-center items-center !gap-2">
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
      <div className="flex justify-center items-center">
        <SelectCustom
          {...register("plan")}
          value={String(planValue)}
          onValueChange={(value: string) => setValue("plan", Number(value))}
          placeholder="انتخاب طرح"
          options={[
            { value: "1", label: "دلتالانچ" },
            { value: "2", label: "دلتامستر" },
            { value: "3", label: "دلتانیکس" },
            { value: "4", label: "دلتامکس" },
            { value: "5", label: "طرح قدیم" },
          ]}
        />
      </div>
    </div>
  );
};

export default FieldGrade;
