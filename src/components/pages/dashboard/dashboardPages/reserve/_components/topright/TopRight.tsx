import { IRegisterStudentService } from "@/lib/apis/reserve/interface";
import CustomRegInput from "../customInput/CustomRegInput";
import { UseFormReturn } from "react-hook-form";

const TopRight = ({
  form,
}: {
  form: UseFormReturn<IRegisterStudentService, undefined>;
}) => {
  return (
    <div className="flex flex-col justify-between items-center w-full gap-3 rounded-xl">
      <CustomRegInput control={form.control} name="first_name" label="نام" />
      <CustomRegInput
        control={form.control}
        name="last_name"
        label="نام خانوادگی"
      />
      <CustomRegInput control={form.control} name="school" label="نام مدرسه" />
    </div>
  );
};

export default TopRight;
