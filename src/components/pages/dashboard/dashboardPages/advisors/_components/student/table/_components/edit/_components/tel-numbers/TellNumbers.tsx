import { UseFormReturn } from "react-hook-form";
import CustomEditInput from "../CustomEditInput";

type EditStudentFormType = {
  id: string;
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
  supervisor_solar_date_day: string;
  supervisor_solar_date_month: string;
  supervisor_solar_date_year: string;
};

const TellNumbers = ({
  form,
}: {
  form: UseFormReturn<EditStudentFormType, undefined>;
}) => {
  return (
    <>
      <CustomEditInput
        control={form.control}
        name="phone_number"
        label="شماره همراه"
        customclass="w-[90%]"
      />
      <CustomEditInput
        control={form.control}
        name="parent_phone"
        label="شماره همراه والدین"
        customclass="w-[90%]"
      />
      <CustomEditInput
        control={form.control}
        name="home_phone"
        label="شماره تلفن منزل"
        customclass="w-[90%]"
      />
    </>
  );
};

export default TellNumbers;
