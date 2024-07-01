import { UseFormReturn, useController } from "react-hook-form";
import CustomFieldSelect from "./CustomFieldSelect";

const FieldSelect = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
      first_name: string;
      last_name: string;
      field: string;
      phone_number: string;
      national_id: string;
      bank_account: string;
    },
    undefined
  >;
}) => {
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
        onValueChange={(value: any) => onChange(value)}
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
