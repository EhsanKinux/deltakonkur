import { UseFormReturn, useController } from "react-hook-form";
import CustomFieldSelect from "./CustomFieldSelect";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";

const LevelSelect = ({ form }: { form: UseFormReturn<ISubmitAdvisorRegisterService, undefined> }) => {
  const { control } = form;

  const {
    field: { onChange, value },
  } = useController({
    name: "level",
    control,
    defaultValue: "",
  });

  return (
    <div className="flex justify-center items-center">
      <CustomFieldSelect
        value={value}
        onValueChange={(value: string) => onChange(value)}
        placeholder="سطح مشاور"
        options={[
          { value: "1", label: "سطح 1" },
          { value: "2", label: "سطح 2" },
          { value: "3", label: "سطح 3" },
          { value: "4", label: "ارشد 1" },
          { value: "5", label: "ارشد 2" },
        ]}
      />
    </div>
  );
};

export default LevelSelect;
