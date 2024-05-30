import React from "react";
import CustomRegInput from "../customInput/CustomRegInput";
import { UseFormReturn } from "react-hook-form";

const TopLeft = ({
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
      <CustomRegInput control={form.control} name="cellphone" label="شماره همراه" />
      <CustomRegInput control={form.control} name="tellphone" label="شماره تلفن منزل" />
      <CustomRegInput control={form.control} name="parentsPhone" label="شماره همراه والدین" />
    </div>
  );
};

export default TopLeft;
