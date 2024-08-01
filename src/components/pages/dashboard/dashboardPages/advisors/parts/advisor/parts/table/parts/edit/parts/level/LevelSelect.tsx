import { UseFormReturn, useController } from "react-hook-form";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";
import CustomFieldSelect from "../../../../../advisorRegisteration/parts/customSelect/CustomFieldSelect";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";

const LevelSelect = ({ form }: { form: UseFormReturn<ISubmitAdvisorRegisterService, undefined> }) => {
  const { control } = form;

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: "level",
    control,
    defaultValue: "1",
  });

  return (
    <FormItem>
      {/* <FormLabel>سطح مشاور</FormLabel> */}
      <FormControl>
        <CustomFieldSelect
          value={value ?? "1"}
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
      </FormControl>
      {error && <FormMessage className="form-message mt-2">{error.message}</FormMessage>}
    </FormItem>
  );
};

export default LevelSelect;
