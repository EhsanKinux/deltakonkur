import { useForm, UseFormReturn } from "react-hook-form";

import SelectRoles from "./_components/selectRoles/SelectRoles";
import { Button } from "@/components/ui/button";

interface FormValues {
  roles: string[];
}

interface SecondFormProps {
  userId: number | null;
}

const SecondForm: React.FC<SecondFormProps> = ({ userId }) => {
  const form: UseFormReturn<FormValues> = useForm<FormValues>({
    defaultValues: {
      roles: [], // Set default value for roles
    },
  });

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="mt-4 w-3/4 px-8">
      <div className="flex flex-col gap-5">
        <SelectRoles form={form} userId={userId} />
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-4">
        <Button
          onClick={handleReset}
          className="form-btn w-full hover:bg-blue-800"
        >
          بازگشت و ثبت کاربر جدید
        </Button>
      </div>
    </div>
  );
};

export default SecondForm;
