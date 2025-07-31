import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import showToast from "@/components/ui/toast";
import { useUsers } from "@/functions/hooks/usersList/useUsers";
import { update_user_info } from "@/lib/apis/users/service";
import { updateUserFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Edit3, Save, X, Phone, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { IUserDetail } from "./interface";
import CustomUserDetailInput from "./_components/CustomUserDetailInput";
import UserDetailSelectRoles from "./_components/selectRoles/UserDetailSelectRoles";

const UserDetails = () => {
  const { userId } = useParams();
  const { getUserDetailInfo, userInfo } = useUsers();
  const [isloading, setIsloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

      try {
        await showToast.promise(update_user_info(modifiedData), {
          loading: "در حال ویرایش اطلاعات...",
          success: `${modifiedData.first_name} ${modifiedData.last_name} با موفقیت بروزرسانی شد`,
          error: (error: unknown) => {
            let errorMessage = "خطا در ویرایش اطلاعات، لطفا دوباره تلاش کنید";
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
            return errorMessage;
          },
        });

        setIsEditing(false);
        form.reset();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsloading(false);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userInfo) {
      form.reset({
        id: "",
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        national_id: userInfo.national_id,
        phone_number: userInfo.phone_number,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <BackButton
          fallbackRoute="/dashboard/management/users"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6"
        >
          بازگشت به لیست کاربران
        </BackButton>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    جزئیات کاربر
                  </h1>
                  <p className="text-blue-100">
                    {userInfo?.first_name} {userInfo?.last_name}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  onClick={handleEditClick}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-6 py-2 transition-all duration-200"
                >
                  <Edit3 className="h-4 w-4 ml-2" />
                  ویرایش
                </Button>
              )}
            </div>
          </div>

          {/* User Information Cards */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Personal Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    اطلاعات شخصی
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">نام و نام خانوادگی</p>
                    <p className="font-medium text-gray-900">
                      {userInfo?.first_name} {userInfo?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">کد ملی</p>
                    <p className="font-medium text-gray-900">
                      {userInfo?.national_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    اطلاعات تماس
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">شماره همراه</p>
                    <p className="font-medium text-gray-900">
                      {userInfo?.phone_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Roles Information Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    نقش‌های کاربر
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">تعداد نقش‌ها</p>
                    <p className="font-medium text-gray-900">
                      {userInfo?.roles?.length || 0} نقش
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 space-x-reverse mb-6">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Edit3 className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    ویرایش اطلاعات
                  </h3>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomUserDetailInput
                        control={form.control}
                        name="first_name"
                        label="نام"
                        placeHolder="نام کاربر"
                      />
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
                    </div>

                    {/* Roles Selection */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <div className="h-6 w-6 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-800">
                          نقش‌های کاربر
                        </h4>
                      </div>
                      <UserDetailSelectRoles
                        userId={userInfo?.id ? Number(userInfo.id) : null}
                        initialRoles={userInfo?.roles || []}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <Button
                        type="submit"
                        disabled={isloading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-6 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isloading ? (
                          <>
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                            در حال ذخیره...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 ml-2" />
                            ذخیره تغییرات
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isloading}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl py-3 px-6 font-medium transition-all duration-200"
                      >
                        <X className="h-4 w-4 ml-2" />
                        انصراف
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {/* View Mode - Roles Section */}
            {!isEditing && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    نقش‌های کاربر
                  </h3>
                </div>
                <UserDetailSelectRoles
                  userId={userInfo?.id ? Number(userInfo.id) : null}
                  initialRoles={userInfo?.roles || []}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
