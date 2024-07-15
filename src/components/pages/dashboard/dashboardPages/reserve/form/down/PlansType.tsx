import { FormField, FormMessage } from "@/components/ui/form";
import CustomSelect from "./parts/customSelect/CustomSelect";
// import { UseFormReturn } from "react-hook-form";

const PlansType = () =>
  //     {
  //   form,
  // }: {
  //   form: UseFormReturn<
  //     {
  //       // id: string;
  //       date_of_birth: string;
  //       first_name: string;
  //       last_name: string;
  //       school: string;
  //       phone_number: string;
  //       home_phone: string;
  //       parent_phone: string;
  //       field: string;
  //       grade: string;
  //       created: string;
  //     },
  //     undefined
  //   >;
  // }
  {
    //   const { register, setValue } = form;
    return (
      <FormField
        //   control={form.control}
        name="field"
        render={() => (
          <div className="flex flex-col w-full">
            <CustomSelect
              // {...register("field")}
              // onValueChange={(value: string) => setValue("field", value)}
              placeholder="نوع طرح"
              options={[
                { value: "طرح نقره‌ای", label: "طرح نقره‌ای" },
                { value: "طرح طلایی", label: "طرح طلایی" },
                { value: "طرح ارشد", label: "طرح ارشد" },
              ]}
            />
            <FormMessage className="form-message mt-2" />
          </div>
        )}
      />
    );
  };

export default PlansType;
