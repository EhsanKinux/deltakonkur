import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { Control, ControllerRenderProps } from "react-hook-form";

interface FormValues {
  student: string;
  plan_score: string;
  report_score: string;
  phone_score: string;
  advisor_behaviour_score: string;
  followup_score: string;
  motivation_score: string;
  exam_score: string;
  advisor_score: string;
}

const CustomInputAssassment = ({
  control,
  name,
  label,
  placeHolder,
  min,
  max,
}: {
  control: Control<
    {
      student: string;
      plan_score: string;
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
    | "advisor_score"
    | "plan_score";
  label: string;
  placeHolder: string;
  min: number;
  max: number;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<FormValues, typeof name>) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);

    // Allow empty input or numbers within the specified range
    if (value === "" || (!isNaN(numberValue) && numberValue >= min && numberValue <= max)) {
      field.onChange(value); // Update form value only if valid
    }
  };

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
              onChange={(e) => handleChange(e, field)}
              value={field.value} // Use the value from field
              onBlur={field.onBlur} // Use the onBlur from field
              ref={field.ref} // Use the ref from field
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </div>
      )}
    />
  );
};

export default CustomInputAssassment;
