import { Controller, UseFormReturn } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { Advisor } from "@/lib/store/types";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IEditAdvisorStudents } from "../../interface";

type OptionType = {
  value: string;
  label: string;
};

const SelectStudentAdvisor = ({
  form,
  memoizedAdvisors,
}: {
  form: UseFormReturn<IEditAdvisorStudents, undefined>;
  memoizedAdvisors: Advisor[];
}) => {
  const advisorOptions: OptionType[] = memoizedAdvisors.map((advisor) => ({
    value: String(advisor.id),
    label: `${advisor.first_name} ${advisor.last_name}`,
  }));

  return (
    <FormField
      control={form.control}
      name="advisor"
      render={({ field }) => {
        // Find the currently selected value as an object
        const selectedValue = advisorOptions.find((option) => option.value === field.value) || null;

        return (
          <FormItem className="flex flex-col bg-slate-100 rounded-xl">
            <FormLabel className="pt-2 font-bold text-slate-500">تعیین مشاور</FormLabel>
            <Controller
              name="advisor"
              control={form.control}
              render={({ field }) => (
                <Select<OptionType>
                  {...field}
                  options={advisorOptions}
                  value={selectedValue}
                  placeholder="انتخاب مشاور"
                  classNamePrefix="react-select"
                  onChange={(selectedOption: SingleValue<OptionType>) => field.onChange(selectedOption?.value || "")}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "primary75" : "rgb(148, 163, 184)",
                      backgroundColor: "rgb(241, 245, 249)",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }),
                  }}
                />
              )}
            />
            <FormMessage className="form-message mt-2 pr-5" />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectStudentAdvisor;
