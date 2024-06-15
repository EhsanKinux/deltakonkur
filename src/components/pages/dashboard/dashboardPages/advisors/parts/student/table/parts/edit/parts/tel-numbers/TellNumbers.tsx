import { UseFormReturn } from "react-hook-form";
import CustomEditInput from "../CustomEditInput";

const TellNumbers = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created:string;
    },
    undefined
  >;
}) => {
  return (
    <>
      <CustomEditInput control={form.control} name="phone_number" label="شماره همراه" customclass="w-[90%]" />
      <CustomEditInput control={form.control} name="parent_phone" label="شماره همراه والدین" customclass="w-[90%]" />
      <CustomEditInput control={form.control} name="phone_number" label="شماره تلفن منزل" customclass="w-[90%]" />
    </>
  );
};

export default TellNumbers;
