import { UseFormReturn } from "react-hook-form";
import CustomSelect from "./parts/customSelect/CustomSelect";
import { FormField } from "@/components/ui/form";

const Down = ({
  form,
}: {
  form: UseFormReturn<
    {
      // id: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created: string;
    },
    undefined
  >;
}) => {
  const { register, setValue } = form;
  return (
    <div className="flex justify-center items-center w-full gap-3 rounded-xl">
      <FormField
        control={form.control}
        name="field"
        render={() => (
          <CustomSelect
            {...register("field")}
            onValueChange={(value: string) => setValue("field", value)}
            placeholder="رشته تحصیلی"
            options={[
              { value: "ریاضی", label: "ریاضی" },
              { value: "تجربی", label: "تجربی" },
              { value: "علوم انسانی", label: "علوم انسانی" },
            ]}
          />
        )}
      />
      <FormField
        control={form.control}
        name="grade"
        render={() => (
          <CustomSelect
            {...register("grade")}
            onValueChange={(value: string) => setValue("grade", value)}
            placeholder="مقطع تحصیلی"
            options={[
              { value: "10", label: "پایه دهم" },
              { value: "11", label: "پایه یازدهم" },
              { value: "12", label: "پایه دوازدهم" },
            ]}
          />
        )}
      />
    </div>
  );
};

export default Down;
