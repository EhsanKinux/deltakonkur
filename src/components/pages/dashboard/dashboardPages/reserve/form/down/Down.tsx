import { UseFormReturn } from "react-hook-form";
import CustomSelect from "./parts/customSelect/CustomSelect";

const Down = ({
  form,
}: {
  form: UseFormReturn<
    {
      name: string;
      lastName: string;
      school: string;
      cellphone: string;
      tellphone: string;
      parentsPhone: string;
      major: string;
      grade: string;
    },
    undefined
  >;
}) => {
  const { register, setValue } = form;
  return (
    <div className="flex justify-center items-center w-full gap-3 py-16  shadow-sidebar bg-slate-100 rounded-xl">
      <CustomSelect
        {...register("major")}
        onValueChange={(value: any) => setValue("major", value)}
        placeholder="رشته تحصیلی"
        options={[
          { value: "math", label: "ریاضی" },
          { value: "biology", label: "تجربی" },
          { value: "humanities", label: "علوم انسانی" },
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