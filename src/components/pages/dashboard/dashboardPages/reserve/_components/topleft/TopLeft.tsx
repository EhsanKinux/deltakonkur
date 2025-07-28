import { IRegisterStudentService } from "@/lib/apis/reserve/interface";
import CustomRegInput from "../customInput/CustomRegInput";
import { UseFormReturn } from "react-hook-form";

const TopLeft = ({ form }: { form: UseFormReturn<IRegisterStudentService, undefined> }) => {
  return (
    <div className="flex flex-col justify-between items-center w-full gap-3 rounded-xl">
      <CustomRegInput control={form.control} name="phone_number" label="شماره همراه" />
      <CustomRegInput control={form.control} name="home_phone" label="شماره تلفن منزل" />
      <CustomRegInput control={form.control} name="parent_phone" label="شماره همراه والدین" />
    </div>
  );
};

export default TopLeft;
