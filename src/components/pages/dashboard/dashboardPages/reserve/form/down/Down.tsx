import { UseFormReturn } from "react-hook-form";
import CustomSelect from "./parts/customSelect/CustomSelect";
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
    <div className="flex flex-col gap-4 w-full rounded-xl">
      <div className="flex justify-center items-center gap-8 w-full">
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
      <div className="flex justify-center items-center w-full">
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <div className="flex flex-col w-full max-w-sm">
              <CustomSelect
                value={String(field.value)}
                onValueChange={(value) => field.onChange(Number(value))}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                placeholder="انتخاب طرح"
                options={[
                  { value: "1", label: "دلتالانچ" },
                  { value: "2", label: "دلتامستر" },
                  { value: "3", label: "دلتانیکس" },
                  { value: "4", label: "دلتامکس" },
                  { value: "5", label: "طرح قدیم" },
                ]}
              />
              <FormMessage className="form-message mt-2" />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Down;
