import { UseFormReturn } from "react-hook-form";
import CustomEditInput from "../CustomEditInput";

const Name = ({
  form,
}: {
  form: UseFormReturn<
    {
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
    },
    undefined
  >;
}) => {
  return (
    <>
      <CustomEditInput control={form.control} name="first_name" label="نام" customclass="w-1/2" />
      <CustomEditInput control={form.control} name="last_name" label="نام خانوادگی" customclass="w-1/2" />
    </>
  );
};

export default Name;
