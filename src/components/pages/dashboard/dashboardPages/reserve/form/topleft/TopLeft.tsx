
import CustomRegInput from "../customInput/CustomRegInput";
import { UseFormReturn } from "react-hook-form";

const TopLeft = ({
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
    <div className="flex flex-col justify-between items-center w-full gap-3 rounded-xl">
      <CustomRegInput control={form.control} name="phone_number" label="شماره همراه" />
      <CustomRegInput control={form.control} name="home_phone" label="شماره تلفن منزل" />
      <CustomRegInput control={form.control} name="parent_phone" label="شماره همراه والدین" />
    </div>
  );
};

export default TopLeft;
