import { UseFormReturn } from "react-hook-form";
import CustomSelect from "./parts/customSelect/CustomSelect";
import { FormField, FormMessage } from "@/components/ui/form";
import { IRegisterStudentService } from "@/lib/apis/reserve/interface";

const Down = ({ form }: { form: UseFormReturn<IRegisterStudentService, undefined> }) => {
  const { setValue, watch } = form;
  
  const fieldValue = watch("field");
  const gradeValue = watch("grade");

  return (
    <div className="flex justify-center items-center gap-8 w-full rounded-xl">
      <FormField
        control={form.control}
        name="field"
        render={() => (
          <div className="flex flex-col w-full">
            <CustomSelect
              value={fieldValue}
              onValueChange={(value: string) => setValue("field", value)}
              placeholder="رشته تحصیلی"
              options={[
                { value: "ریاضی", label: "ریاضی" },
                { value: "تجربی", label: "تجربی" },
                { value: "علوم انسانی", label: "علوم انسانی" },
              ]}
            />
            <FormMessage className="form-message mt-2" />
          </div>
        )}
      />
      <FormField
        control={form.control}
        name="grade"
        render={() => (
          <div className="flex flex-col w-full">
            <CustomSelect
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
            <FormMessage className="form-message mt-2" />
          </div>
        )}
      />
    </div>
  );
};

export default Down;
