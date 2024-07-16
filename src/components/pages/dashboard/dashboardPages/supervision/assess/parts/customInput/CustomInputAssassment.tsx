import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

const CustomInputAssassment = ({
  control,
  name,
  label,
  placeHolder,
}: {
  control: Control<
    {
      student: string;
      report_score: string;
      phone_score: string;
      advisor_behaviour_score: string;
      followup_score: string;
      motivation_score: string;
      exam_score: string;
      advisor_score: string;
    },
    undefined
  >;
  name:
    | "report_score"
    | "phone_score"
    | "advisor_behaviour_score"
    | "followup_score"
    | "motivation_score"
    | "exam_score"
    | "advisor_score";
  label: string;
  placeHolder: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`flex flex-col w-full gap-2 mt-2`}>
          <FormLabel className="pr-5 font-semibold">{label}</FormLabel>
          <FormControl className="">
            <Input
              id={name}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-400"
              type="text"
              placeholder={placeHolder}
              {...field}
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </div>
      )}
    />
  );
};

export default CustomInputAssassment;