import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogContent } from "@/components/ui/dialog";
import showToast from "@/components/ui/toast";
import { useUsers } from "@/functions/hooks/usersList/useUsers";
import { update_user_info } from "@/lib/apis/users/service";
import { updateUserFormSchema } from "@/lib/schema/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  X,
  Shield,
  Edit3,
  AlertCircle,
  User,
  Phone,
  CreditCard,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IUserDetail } from "./interface";
import SmartInput from "@/components/ui/SmartInput";
import UserDetailSelectRoles from "./_components/selectRoles/UserDetailSelectRoles";

// Extended User interface for display purposes
interface UserDisplay extends Omit<IUserDetail, "roles"> {
  roles: string; // Transformed from number[] to string
}

interface UserDetailsModalProps {
  user: UserDisplay | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserDetailsModal = ({
  user,
  onClose,
  onSuccess,
}: UserDetailsModalProps) => {
  const { getUserDetailInfo, userInfo } = useUsers();
  const [isloading, setIsloading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const initialValuesRef = useRef<z.infer<typeof formSchema> | null>(null);

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
    mode: "onChange", // Enable real-time validation
  });

  // Fetch user details when modal opens
  useEffect(() => {
    if (user?.id) {
      getUserDetailInfo(user.id);
    }
  }, [getUserDetailInfo, user?.id]);

  // Update form when user info is loaded
  useEffect(() => {
    if (userInfo) {
      const formData = {
        id: "",
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        national_id: userInfo.national_id,
        phone_number: userInfo.phone_number,
      };

      form.reset(formData);
      initialValuesRef.current = formData;
      setHasChanges(false);
    }
  }, [form, userInfo]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (initialValuesRef.current) {
        const hasFormChanges =
          value.first_name !== initialValuesRef.current.first_name ||
          value.last_name !== initialValuesRef.current.last_name ||
          value.national_id !== initialValuesRef.current.national_id ||
          value.phone_number !== initialValuesRef.current.phone_number;

        setHasChanges(hasFormChanges);

        // Clear submit error when form changes
        if (submitError) {
          setSubmitError(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, submitError]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Double-check validation before submission
    const isValid = await form.trigger();
    if (!isValid) {
      console.log("Form validation failed:", form.formState.errors);
      return; // Don't proceed if validation fails
    }

    setIsloading(true);
    setSubmitError(null);

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
                } else if (errorJson.phone_number) {
                  errorMessage = "شماره تلفن معتبر نیست!";
                } else if (errorJson.first_name) {
                  errorMessage = "نام نمی‌تواند خالی باشد!";
                } else if (errorJson.last_name) {
                  errorMessage = "نام خانوادگی نمی‌تواند خالی باشد!";
                }
              } catch (parseError) {
                console.error("Error parsing the error message:", parseError);
              }
            }
            return errorMessage;
          },
        });

        // Only close modal and refresh on success
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Error:", error);
        // Set submit error to show in the modal - DON'T close modal
        setSubmitError("خطا در ویرایش اطلاعات، لطفا دوباره تلاش کنید");
      } finally {
        setIsloading(false);
      }
    }
  };

  // Check if form is valid and has changes
  const isFormValid = form.formState.isValid;
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  const canSubmit =
    isFormValid && !isloading && !submitError && hasChanges && !hasErrors;

  // Force validation on form state changes
  useEffect(() => {
    if (hasChanges) {
      form.trigger(); // Trigger validation when form changes
    }
  }, [form, hasChanges]);

  return (
    <DialogContent className="bg-white !rounded-2xl border-0 shadow-2xl max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Edit Form */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse mb-6">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Edit3 className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            ویرایش اطلاعات کاربر
          </h3>
        </div>

        {/* Submit Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3 space-x-reverse">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">خطا در ذخیره اطلاعات:</p>
                <p className="text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Validation Summary */}
        {hasErrors && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="h-5 w-5 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">
                  لطفاً خطاهای زیر را برطرف کنید:
                </p>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  {form.formState.errors.first_name && (
                    <li>نام: {form.formState.errors.first_name.message}</li>
                  )}
                  {form.formState.errors.last_name && (
                    <li>
                      نام خانوادگی: {form.formState.errors.last_name.message}
                    </li>
                  )}
                  {form.formState.errors.national_id && (
                    <li>کد ملی: {form.formState.errors.national_id.message}</li>
                  )}
                  {form.formState.errors.phone_number && (
                    <li>
                      شماره همراه: {form.formState.errors.phone_number.message}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* No Changes Warning */}
        {!hasChanges && !hasErrors && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">هیچ تغییری اعمال نشده است</p>
                <p className="text-blue-700">
                  برای ذخیره تغییرات، ابتدا اطلاعات را ویرایش کنید
                </p>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SmartInput
                control={form.control}
                name="first_name"
                label="نام"
                placeholder="نام کاربر"
                icon={User}
                required={true}
                validationType="persianName"
              />
              <SmartInput
                control={form.control}
                name="last_name"
                label="نام خانوادگی"
                placeholder="نام خانوادگی کاربر"
                icon={User}
                required={true}
                validationType="persianName"
              />
              <SmartInput
                control={form.control}
                name="national_id"
                label="کد ملی"
                placeholder="کد ملی کاربر"
                icon={CreditCard}
                type="number"
                required={true}
                validationType="nationalId"
                maxLength={10}
              />
              <SmartInput
                control={form.control}
                name="phone_number"
                label="شماره همراه"
                placeholder="شماره همراه کاربر"
                icon={Phone}
                type="tel"
                required={true}
                validationType="phone"
                maxLength={11}
              />
            </div>

            {/* Roles Selection */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="h-6 w-6 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800">نقش‌های کاربر</h4>
              </div>
              <UserDetailSelectRoles
                refreshTable={onSuccess}
                userId={userInfo?.id ? Number(userInfo.id) : null}
                initialRoles={userInfo?.roles || []}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-6 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClick={onClose}
                disabled={isloading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl py-3 px-6 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4 ml-2" />
                انصراف
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default UserDetailsModal;
