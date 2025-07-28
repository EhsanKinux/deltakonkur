import { UseFormReturn } from "react-hook-form";
import CustomSelect from "./_components/customSelect/CustomSelect";
import { FormField, FormMessage } from "@/components/ui/form";
import { IRegisterStudentService } from "@/lib/apis/reserve/interface";

const Down = ({
  form,
}: {
  form: UseFormReturn<IRegisterStudentService, undefined>;
}) => {
  // Removed unused: const { setValue, watch } = form;
  // Removed unused: const fieldValue = watch("field");
  // Removed unused: const gradeValue = watch("grade");

  return (
    <div className="flex justify-center items-center gap-8 w-full rounded-xl">
      <FormField
        control={form.control}
        name="field"
        render={({ field }) => (
          <div className="flex flex-col w-full">
            <CustomSelect
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
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
        render={({ field }) => (
          <div className="flex flex-col w-full">
            <CustomSelect
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
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
