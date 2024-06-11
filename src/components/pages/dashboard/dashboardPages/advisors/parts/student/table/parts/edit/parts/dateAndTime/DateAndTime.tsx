import { UseFormReturn } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";

const DateAndTime = ({
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
      created: string;
    },
    undefined
  >;
}) => {
  const [value, setValue] = useState(form.getValues("created") || "");

  useEffect(() => {
    const createdValue = form.getValues("created");
    if (createdValue) {
      setValue(createdValue);
    }
  }, [form]);

  const formatDate = (value: string) => {
    if (value.length !== 8) return value;
    return `${value.substring(0, 4)} - ${value.substring(4, 6)} - ${value.substring(6, 8)}`;
  };

  return (
    <FormField
      control={form.control}
      name="created"
      render={({ field }) => (
        <FormItem>
          <FormLabel>تاریخ:</FormLabel>
          <FormControl>
            <InputOTP maxLength={8} {...field} value={value} onChange={(value) => setValue(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={7} style={otpSlotStyle} />
                <InputOTPSlot index={6} style={otpSlotStyle} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={5} style={otpSlotStyle} />
                <InputOTPSlot index={4} style={otpSlotStyle} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} style={otpSlotStyle} />
                <InputOTPSlot index={2} style={otpSlotStyle} />
                <InputOTPSlot index={1} style={otpSlotStyle} />
                <InputOTPSlot index={0} style={otpSlotStyle} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormDescription>
            {value === "" ? <>تاریخ ثبت را وارد کنید</> : <>تاریخ جدید: {formatDate(value)}</>}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const otpSlotStyle = {
  width: "1.5em",
  height: "1.5em",
  margin: "0.1em",
  paddingTop: "8px",
  textAlign: "center" as const,
  fontSize: "1.5em",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

export default DateAndTime;
