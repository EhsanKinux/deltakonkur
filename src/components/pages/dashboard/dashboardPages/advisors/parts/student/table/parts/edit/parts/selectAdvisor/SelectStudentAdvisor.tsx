import { UseFormReturn } from "react-hook-form";
import CustomAdvisorSelect from "./CustomAdvisorSelect";
import { Advisor } from "@/lib/store/types";
import { FormDescription, FormLabel, FormMessage } from "@/components/ui/form";

const SelectStudentAdvisor = ({
  form,
  memoizedAdvisors,
}: {
  form: UseFormReturn<
    {
      id: string;
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
    },
    undefined
  >;
  memoizedAdvisors: Advisor[];
}) => {
  const { register, setValue, watch } = form;
  const advisorValue = watch("advisor");

  return (
    <div className="flex flex-col !gap-2 bg-slate-100 rounded-xl">
      <FormLabel className="pr-5">تعیین مشاور</FormLabel>
      <CustomAdvisorSelect
        {...register("advisor")}
        value={advisorValue}
        onValueChange={(value: string) => setValue("advisor", value)}
        placeholder="انتخاب مشاور"
        options={memoizedAdvisors.map((advisor) => ({
          value: advisor.first_name,
          label: `${advisor.first_name} ${advisor.last_name}`,
        }))}
      />
      <FormDescription className="pr-5">
        مشاور دانش آموز را تعیین کنید!
      </FormDescription>
      <FormMessage />
    </div>
  );
};

export default SelectStudentAdvisor;
