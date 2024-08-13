import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
// import { UseFormReturn } from "react-hook-form";

const PlansType = ({
  control,
  name,
  label,
}: {
  control: Control<
    {
      id: string;
      date_of_birth: string;
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
      package_price: string;
    },
    undefined
  >;
  name:
    | "first_name"
    | "last_name"
    | "school"
    | "phone_number"
    | "home_phone"
    | "parent_phone"
    | "field"
    | "grade"
    | "package_price";
  label: string;
}) => {
  //   const { register, setValue } = form;

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const valueWithoutCommas = e.target.value.replace(/,/g, "");
          field.onChange(valueWithoutCommas);
        };

        return (
          <div className="flex flex-col w-full gap-2">
            <FormLabel>{label}</FormLabel>
            <FormControl className="">
              <div className="relative">
                <Input
                  id={name}
                  className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 pl-10"
                  placeholder={label}
                  type="text"
                  value={formatNumber(field.value)}
                  onChange={handleChange}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                />
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">ریال</span>
              </div>
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        );
      }}
    />
  );
};

export default PlansType;
