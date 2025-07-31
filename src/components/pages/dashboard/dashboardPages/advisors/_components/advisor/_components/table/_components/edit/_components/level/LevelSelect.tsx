import { UseFormReturn } from "react-hook-form";
import { ISubmitAdvisorRegisterService } from "@/lib/apis/advisors/interface";
import EnhancedSelect from "@/components/ui/EnhancedSelect";

const LevelSelect = ({
  form,
}: {
  form: UseFormReturn<ISubmitAdvisorRegisterService, undefined>;
}) => {
  const { control } = form;

  return (
    <EnhancedSelect<ISubmitAdvisorRegisterService>
      control={control}
      name="level"
      label="سطح مشاور"
      placeholder="سطح مشاور را انتخاب کنید"
      options={[
        { value: "1", label: "سطح 1", description: "مشاور تازه کار" },
        { value: "2", label: "سطح 2", description: "مشاور با تجربه" },
        { value: "3", label: "سطح 3", description: "مشاور ارشد" },
        { value: "4", label: "ارشد 1", description: "مشاور ارشد سطح 1" },
        { value: "5", label: "ارشد 2", description: "مشاور ارشد سطح 2" },
      ]}
      required
    />
  );
};

export default LevelSelect;
