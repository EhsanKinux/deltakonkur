import { UseFormReturn, useController } from "react-hook-form";
import CustomFieldSelect from "./CustomFieldSelect";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";

const FieldSelect = ({ form }: { form: UseFormReturn<ISubmitAdvisorRegisterService, undefined> }) => {
  const { control } = form;

  const {
    field: { onChange, value },
  } = useController({
    name: "field",
    control,
    defaultValue: "",
  });

  return (
    <div className="flex justify-center items-center">
      <CustomFieldSelect
        value={value}
        onValueChange={(value: string) => onChange(value)}
        placeholder="رشته تحصیلی"
        options={[
          { value: "ریاضی", label: "ریاضی" },
          { value: "تجربی", label: "تجربی" },
          { value: "علوم انسانی", label: "علوم انسانی" },
        ]}
      />
    </div>
  );
};

export default FieldSelect;
