import { UseFormReturn } from "react-hook-form";
import CustomEditInput from "../CustomEditInput";

const Name = ({
  form,
}: {
  form: UseFormReturn<
    {
      id: string;
      // date_of_birth: string;
      first_name: string;
      last_name: string;
      school: string;
      phone_number: string;
      home_phone: string;
      parent_phone: string;
      field: string;
      grade: string;
      created: string;
      advisor: string;
      supervisor: string;
      package_price: string;
      solar_date_day: string;
      solar_date_month: string;
      solar_date_year: string;
    },
    undefined
  >;
}) => {
  return (
    <>
      <CustomEditInput control={form.control} name="first_name" label="نام" />
      <CustomEditInput
        control={form.control}
        name="last_name"
        label="نام خانوادگی"
      />
    </>
  );
};

export default Name;
