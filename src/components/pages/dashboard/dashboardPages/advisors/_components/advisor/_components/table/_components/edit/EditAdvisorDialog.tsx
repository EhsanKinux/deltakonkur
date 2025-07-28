import { useAdvisorsList } from "@/functions/hooks/advisorsList/useAdvisorsList";
import { editAdvisorFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import CustomEditAdvisorInput from "./_components/CustomEditAdvisorInput";
import SelectField from "./_components/field/SelectField";
import LevelSelect from "./_components/level/LevelSelect";
import showToast from "@/components/ui/toast";

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
        level:
          advisorInfo?.level !== undefined ? String(advisorInfo.level) : "1",
      });
    }
  }, [advisorInfo, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data && advisorInfo) {
      const loadingToastId = showToast.loading("در حال انجام عملیات ویرایش...");
      try {
        await updatAdvisor(data);
        showToast.dismiss(loadingToastId);
        showToast.success("ویرایش اظلاعات با موفقیت انجام شد.");

        // Set a timeout before reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 3-second delay
      } catch (error) {
        showToast.dismiss(loadingToastId);
        let errorMessage = "خطایی رخ داده است، لطفا دوباره تلاش کنید";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        showToast.error(errorMessage);
      }

      setEditDialogOpen(false);
    }
  };

  return (
    <>
      <DialogContent
        className="bg-slate-100 !rounded-[10px] h-screen md:h-fit flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="w-full">
          <DialogTitle>ویرایش اطلاعات</DialogTitle>
          <DialogDescription>
            بعد از انجام ویرایش برای ذخیره اطلاعات روی ثبت ویرایش کلیک کنید
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-scroll py-4">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col md:flex-row justify-between gap-5">
                    <CustomEditAdvisorInput
                      control={form.control}
                      name="first_name"
                      label="نام"
                      placeHolder="اصغر"
                    />
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
                </div>
              </div>
              <DialogFooter>
                <div className="flex justify-between items-center w-full">
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2"
                  >
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
            </form>
          </Form>
        </div>
      </DialogContent>
    </>
  );
};

export default EditAdvisorDialog;
