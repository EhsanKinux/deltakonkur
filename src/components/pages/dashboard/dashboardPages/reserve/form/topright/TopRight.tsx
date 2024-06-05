import React from "react";
import CustomRegInput from "../customInput/CustomRegInput";
import { UseFormReturn } from "react-hook-form";

const TopRight = ({
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
    <div className="flex flex-col justify-between items-center w-full gap-3 py-16 shadow-sidebar bg-slate-100 rounded-xl">
      <CustomRegInput control={form.control} name="first_name" label="نام" />
      <CustomRegInput control={form.control} name="last_name" label="نام خانوادگی" />
      <CustomRegInput control={form.control} name="school" label="نام مدرسه" />
    </div>
  );
};

export default TopRight;
