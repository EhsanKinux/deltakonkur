import { UseFormReturn } from "react-hook-form";
import CustomAdvisorSelect from "./CustomAdvisorSelect";
import { Advisor } from "@/lib/store/types";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IEditAdvisorStudents } from "../../interface";

const SelectStudentAdvisor = ({
  form,
  memoizedAdvisors,
}: {
  form: UseFormReturn<IEditAdvisorStudents, undefined>;
  memoizedAdvisors: Advisor[];
}) => {
  const { register, setValue, watch } = form;
  const advisorValue = watch("advisor");

  return (
    <FormField
      control={form.control}
      name="advisor"
      render={() => (
        <FormItem className="w-full flex flex-col bg-slate-100 rounded-xl">
          <FormLabel className="pt-2 font-bold text-slate-500">تعیین مشاور</FormLabel>
          <CustomAdvisorSelect
            {...register("advisor")}
            value={advisorValue}
            onValueChange={(value: string) => setValue("advisor", value)}
            placeholder="انتخاب مشاور"
            options={memoizedAdvisors.map((advisor) => ({
              value: String(advisor.id),
              label: `${advisor.first_name} ${advisor.last_name}`,
            }))}
          />
          {/* <FormDescription className="pr-5">مشاور دانش آموز را تعیین کنید!</FormDescription> */}
          <FormMessage className="form-message mt-2 pr-5" />
        </FormItem>
      )}
    />
  );
};

export default SelectStudentAdvisor;
