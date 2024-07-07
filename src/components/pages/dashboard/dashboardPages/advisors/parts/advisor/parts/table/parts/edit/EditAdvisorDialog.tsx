import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { editAdvisorFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Advisor } from "@/lib/store/types";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomEditAdvisorInput from "./parts/CustomEditAdvisorInput";
import SelectField from "./parts/field/SelectField";

const EditAdvisorDialog = ({
  setEditDialogOpen,
}: {
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { advisorInfo } = useAdvisorsList();
  // const setRefresh = appStore((state) => state.setRefresh);

  const handleEditCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDialogOpen(false);
  };

  const formSchema = editAdvisorFormSchema();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      field: "",
      bank_account: "",
      national_id: "",
    },
  });

  useEffect(() => {
    if (advisorInfo) {
      form.reset({
        id: "",
        first_name: advisorInfo?.first_name,
        last_name: advisorInfo?.last_name,
        phone_number: advisorInfo?.phone_number,
        field: advisorInfo?.field,
        national_id: advisorInfo?.national_id,
        bank_account: advisorInfo?.bank_account,
      });
    }
    // if (error) {
    //   console.log(error);
    // }
  }, [advisorInfo, form]);

  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    if (data && advisorInfo) {
      const modifiedData: Advisor = {
        ...data,
        id: String(advisorInfo.id),
      };
      console.table(modifiedData);

      //   setRefresh(true);
      //   dialogCloseRef.current?.click(); // Trigger dialog close
    }
  };

  //   if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DialogContent className="bg-slate-100 !rounded-[10px]">
        <DialogHeader>
          <DialogTitle>ویرایش اطلاعات</DialogTitle>
          <DialogDescription>بعد از انجام ویرایش برای ذخیره اطلاعات روی ثبت ویرایش کلیک کنید</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row justify-between gap-5">
                  <CustomEditAdvisorInput control={form.control} name="first_name" label="نام" placeHolder="اصغر" />
                  <CustomEditAdvisorInput
                    control={form.control}
                    name="last_name"
                    label="نام خانوادگی"
                    placeHolder="فرهادی"
                  />
                </div>
                <CustomEditAdvisorInput
                  control={form.control}
                  name="phone_number"
                  label="شماره همراه"
                  placeHolder="09012345678"
                />
                <div className="flex flex-col md:flex-row justify-between gap-5">
                  <CustomEditAdvisorInput
                    control={form.control}
                    name="national_id"
                    label="کد ملی"
                    placeHolder="31212301234"
                  />
                  <CustomEditAdvisorInput
                    control={form.control}
                    name="bank_account"
                    label="شماره حساب"
                    placeHolder="312123123123"
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-5">
                  <div className="w-full">
                    <SelectField form={form} />
                  </div>
                </div>
                <DialogFooter>
                  <div className="flex justify-between items-center w-full">
                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2">
                      ثبت ویرایش
                    </Button>
                    <Button
                      ref={dialogCloseRef}
                      className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
                      onClick={() => handleEditCancel}
                    >
                      لغو
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </>
  );
};

export default EditAdvisorDialog;
