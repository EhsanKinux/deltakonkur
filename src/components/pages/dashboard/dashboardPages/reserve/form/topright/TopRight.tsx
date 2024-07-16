import CustomRegInput from "../customInput/CustomRegInput";
import { UseFormReturn } from "react-hook-form";

const TopRight = ({
  form,
}: {
  form: UseFormReturn<
    {
      // id: string;
      date_of_birth: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created: string;
      solar_date_day: string;
      solar_date_month: string;
      solar_date_year: string;
    },
    undefined
  >;
}) => {
  return (
    <div className="flex flex-col justify-between items-center w-full gap-3 rounded-xl">
      <CustomRegInput control={form.control} name="first_name" label="نام" />
      <CustomRegInput control={form.control} name="last_name" label="نام خانوادگی" />
      <CustomRegInput control={form.control} name="school" label="نام مدرسه" />
    </div>
  );
};

export default TopRight;
