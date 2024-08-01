import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { editAdvisorFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { Advisor } from "@/lib/store/types";
import {
  // DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomEditAdvisorInput from "./parts/CustomEditAdvisorInput";
import SelectField from "./parts/field/SelectField";
import LevelSelect from "./parts/level/LevelSelect";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditAdvisorDialog = ({
  setEditDialogOpen,
}: {
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { advisorInfo, updatAdvisor } = useAdvisorsList();
  // const navigate = useNavigate();
  // const setRefresh = appStore((state) => state.setRefresh);

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
      level: "1",
    },
  });

  useEffect(() => {
    if (advisorInfo) {
      form.reset({
        id: String(advisorInfo.id),
        first_name: advisorInfo?.first_name,
        last_name: advisorInfo?.last_name,
        phone_number: advisorInfo?.phone_number,
        field: advisorInfo?.field,
        national_id: advisorInfo?.national_id,
        bank_account: advisorInfo?.bank_account,
        level: advisorInfo?.level !== undefined ? String(advisorInfo.level) : "1",
      });
    }
  }, [advisorInfo, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log("Form submitted with data:", data);
    if (data && advisorInfo) {
      const loadingToastId = toast.loading("در حال انجام عملیات ویرایش...", { duration: 3000 });
      try {
        // const modifiedData: Advisor = {
        //   ...data,
        //   id: String(advisorInfo.id),
        // };
        await updatAdvisor(data);
        toast.dismiss(loadingToastId);
        toast.success("ویرایش اظلاعات با موفقیت انجام شد.");

        // Set a timeout before reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 3-second delay
      } catch (error) {
        toast.dismiss(loadingToastId);
        let errorMessage = "خطایی رخ داده است، لطفا دوباره تلاش کنید";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }

      setEditDialogOpen(false);
    }
  };

  //  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DialogContent className="bg-slate-100 !rounded-[10px]" onClick={(e) => e.stopPropagation()}>
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
                  <div className="w-full">
                    <LevelSelect form={form} />
                  </div>
                </div>
                <DialogFooter>
                  <div className="flex justify-between items-center w-full">
                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2">
                      ثبت ویرایش
                    </Button>
                    {/* <DialogClose> */}
                    <Button
                      type="button"
                      onClick={() => setEditDialogOpen(false)}
                      className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
                    >
                      لغو
                    </Button>
                    {/* </DialogClose> */}
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
