import { UseFormReturn } from "react-hook-form";
import CustomEditInput from "../CustomEditInput";

const TellNumbers = ({
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
      <CustomEditInput control={form.control} name="phone_number" label="شماره همراه" />
      <CustomEditInput control={form.control} name="parent_phone" label="شماره همراه والدین" />
      <CustomEditInput control={form.control} name="phone_number" label="شماره تلفن منزل" />
    </>
  );
};

export default TellNumbers;