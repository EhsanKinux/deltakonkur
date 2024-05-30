import { UseFormReturn } from "react-hook-form";
import CustomRegInput from "../customInput/CustomRegInput";

const Down = ({
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
    <div className="flex justify-center items-center w-full gap-4 py-8 shadow-sidebar bg-slate-100 rounded-xl">
      <CustomRegInput control={form.control} name="major" label="رشته تحصیلی" />
      <CustomRegInput control={form.control} name="grade" label="مقطع تحصیلی" />
    </div>
  );
};

export default Down;
