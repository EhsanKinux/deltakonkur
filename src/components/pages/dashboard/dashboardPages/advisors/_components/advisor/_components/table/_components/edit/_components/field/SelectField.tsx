import { useController, UseFormReturn } from "react-hook-form";
import CustomFieldSelect from "../../../../../advisorRegisteration/_components/customSelect/CustomFieldSelect";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";

const SelectField = ({
  form,
}: {
  form: UseFormReturn<ISubmitAdvisorRegisterService, undefined>;
}) => {
  const { control } = form;

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: "field",
    control,
    defaultValue: "",
  });

  return (
    <FormItem>
      {/* <FormLabel>سطح مشاور</FormLabel> */}
      <FormControl>
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
      </FormControl>
      {error && (
        <FormMessage className="form-message mt-2">{error.message}</FormMessage>
      )}
    </FormItem>
  );
};

export default SelectField;
