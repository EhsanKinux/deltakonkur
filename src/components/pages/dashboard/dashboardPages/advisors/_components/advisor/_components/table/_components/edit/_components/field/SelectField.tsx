import { UseFormReturn } from "react-hook-form";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";
import EnhancedSelect from "@/components/ui/EnhancedSelect";

const SelectField = ({
  form,
}: {
  form: UseFormReturn<ISubmitAdvisorRegisterService, undefined>;
}) => {
  const { control } = form;

  return (
    <EnhancedSelect<ISubmitAdvisorRegisterService>
      control={control}
      name="field"
      label="رشته تحصیلی"
      placeholder="رشته تحصیلی را انتخاب کنید"
      options={[
        { value: "ریاضی", label: "ریاضی", description: "رشته ریاضی و فیزیک" },
        { value: "تجربی", label: "تجربی", description: "رشته علوم تجربی" },
        {
          value: "علوم انسانی",
          label: "علوم انسانی",
          description: "رشته علوم انسانی",
        },
      ]}
      required
    />
  );
};

export default SelectField;
