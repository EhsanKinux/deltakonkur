import { UseFormReturn } from "react-hook-form";
import CustomSelect from "./parts/customSelect/CustomSelect";

const Down = ({
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
  const { register, setValue } = form;
  return (
    <div className="flex justify-center items-center w-full gap-3 py-16  shadow-sidebar bg-slate-100 rounded-xl">
      <CustomSelect
        {...register("field")}
        onValueChange={(value: any) => setValue("field", value)}
        placeholder="رشته تحصیلی"
        options={[
          { value: "ریاضی", label: "ریاضی" },
          { value: "تجربی", label: "تجربی" },
          { value: "علوم انسانی", label: "علوم انسانی" },
        ]}
      />
      <CustomSelect
        {...register("grade")}
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

export default Down;
