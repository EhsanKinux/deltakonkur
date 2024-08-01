import { UseFormReturn } from "react-hook-form";
import CustomEditInput from "../CustomEditInput";
import CustomEditInput2 from "./CostumEditInput";

const TellNumbers = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
      date_of_birth: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created:string;
      advisor:string;
    },
    undefined
  >;
}) => {
  return (
    <>
      <CustomEditInput2 control={form.control} name="phone_number" label="شماره همراه" customclass="w-[90%]" />
      <CustomEditInput control={form.control} name="parent_phone" label="شماره همراه والدین" customclass="w-[90%]" />
      <CustomEditInput control={form.control} name="phone_number" label="شماره تلفن منزل" customclass="w-[90%]" />
    </>
  );
};

export default TellNumbers;
