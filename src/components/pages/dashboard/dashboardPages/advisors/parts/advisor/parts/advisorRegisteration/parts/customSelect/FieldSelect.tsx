import { UseFormReturn } from "react-hook-form";
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
  const { register, setValue } = form;
  return (
    <div className="flex justify-center items-center w-full">
      <CustomFieldSelect
        {...register("field")}
        onValueChange={(value: any) => setValue("field", value)}
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
