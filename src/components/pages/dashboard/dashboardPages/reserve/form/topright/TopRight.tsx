import React from "react";
import CustomRegInput from "../customInput/CustomRegInput";
import { UseFormReturn } from "react-hook-form";

const TopRight = ({
  form,
}: {
  form: UseFormReturn<
    {
      name: string;
      lastName: string;
      school: string;
      cellphone: string;
      tellphone: string;
      parentsPhone: string;
      major: string;
      grade: string;
    },
    undefined
  >;
}) => {
  return (
    <div className="flex flex-col justify-between items-center w-full gap-3 py-16 shadow-sidebar bg-slate-100 rounded-xl">
      <CustomRegInput control={form.control} name="name" label="نام" />
      <CustomRegInput control={form.control} name="lastName" label="نام خانوادگی" />
      <CustomRegInput control={form.control} name="school" label="نام مدرسه" />
    </div>
  );
};

export default TopRight;
