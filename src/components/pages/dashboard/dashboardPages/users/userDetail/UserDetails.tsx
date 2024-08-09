import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateUserFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import CustomUserDetailInput from "./parts/CustomUserDetailInput";
import UserDetailSelectRoles from "./parts/selectRoles/UserDetailSelectRoles";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useUsers } from "@/functions/hooks/usersList/useUsers";
import { IUserDetail } from "./interface";
import { toast } from "sonner";
import { update_user_info } from "@/lib/apis/users/service";
import backIcon from "@/assets/icons/back.svg";

const UserDetails = () => {
  const { userId } = useParams();
  const { getUserDetailInfo, userInfo } = useUsers();
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (userId) {
      getUserDetailInfo(userId);
    }
  }, [getUserDetailInfo, userId]);

  const formSchema = updateUserFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      first_name: "",
      last_name: "",
      national_id: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      form.reset({
        id: "",
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        national_id: userInfo.national_id,
        phone_number: userInfo.phone_number,
      });
    }
  }, [form, userInfo]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    if (data && userInfo) {
      const modifiedData: IUserDetail = {
        ...data,
        id: String(userInfo.id),
      };
      // console.log(modifiedData);
      const loadingToastId = toast.loading("در حال انجام عملیات ویرایش...");
      try {
        const response = await update_user_info(modifiedData);
        if (response) {
          toast.dismiss(loadingToastId);
          toast.success(`ثبت ${modifiedData.first_name} ${modifiedData.last_name} با موفقیت انجام شد`);
        }
      } catch (error) {
        toast.dismiss(loadingToastId);
        console.error("Error:", error);

        // Parsing the error message
        let errorMessage = "خطا در ثبت کاربر، لطفا دوباره تلاش کنید";
        if (error instanceof Error) {
          try {
            const errorJson = JSON.parse(error.message);
            if (errorJson.national_id) {
              errorMessage = "کد ملی حتما باید 10 رقم باشد و تکراری نباشد!";
            }
          } catch (parseError) {
            console.error("Error parsing the error message:", parseError);
          }
        }

        toast.error(errorMessage);
      } finally {
        setIsloading(false);
        form.reset();
      }
      setIsloading(false);
    }
  };

  const handleBackClick = () => {
    form.reset();
    navigate("/dashboard/users");
  };

  return (
    <>
      <Button
        className="flex gap-2 pt-4 pb-3 font-bold text-base text-slate-600 rounded hover:text-blue-600"
        onClick={handleBackClick}
      >
        <img className="w-5 pb-[2px]" src={backIcon} alt="backIcon" />
        <span>بازگشت</span>
      </Button>
      <section className="mt-8 flex flex-col items-center justify-center bg-slate-100 rounded-xl pb-10 shadow-form">
        <div className="w-full bg-slate-400 rounded-b-full flex justify-center items-center gap-3 flex-col p-5">
          {/* <img src={AddAdvisor} width={500} /> */}
          <h3 className="text-3xl text-white font-bold">
            ویرایش اطلاعات {userInfo?.first_name} {userInfo?.last_name}
          </h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-3/4 px-8">
            <div className="flex flex-col gap-5">
              <CustomUserDetailInput control={form.control} name="first_name" label="نام" placeHolder="نام کاربر" />
              <CustomUserDetailInput
                control={form.control}
                name="last_name"
                label="نام خانوادگی"
                placeHolder="نام خانوادگی کاربر"
              />
              <CustomUserDetailInput
                control={form.control}
                name="national_id"
                label="کد ملی"
                placeHolder="کد ملی کاربر"
              />
              <CustomUserDetailInput
                control={form.control}
                name="phone_number"
                label="شماره همراه"
                placeHolder="شماره همراه کاربر"
              />
              <UserDetailSelectRoles
                userId={userInfo?.id ? Number(userInfo.id) : null}
                initialRoles={userInfo?.roles || []}
              />
            </div>

            <div className="flex justify-center items-center w-full mt-4 gap-4">
              <Button type="submit" className="form-btn w-full hover:bg-blue-800">
                {isloading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp; در حال ثبت...
                  </>
                ) : (
                  "ثبت ویرایش کاربر"
                )}
              </Button>
              <Button
                type="reset"
                className="w-full bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
                onClick={handleBackClick}
              >
                {isloading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp; در حال ثبت...
                  </>
                ) : (
                  "لغو ویرایش کاربر و بازگشت"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  );
};

export default UserDetails;
