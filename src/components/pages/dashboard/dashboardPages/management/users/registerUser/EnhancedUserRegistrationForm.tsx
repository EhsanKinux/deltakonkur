import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormSection from "@/components/ui/FormSection";
import SmartInput from "@/components/ui/SmartInput";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Phone,
  User,
  UserPlus,
  CreditCard,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { FORM_SECTIONS, HELP_GUIDE } from "./constants/formOptions";
import { useUserRegistrationForm } from "./hooks/useUserRegistrationForm";
import EnhancedRoleSelector from "./_components/EnhancedRoleSelector";

const EnhancedUserRegistrationForm = () => {
  const {
    form,
    isLoading,
    currentStep,
    resetKey,
    handleFirstStepSubmit,
    handleSecondStepSubmit,
  } = useUserRegistrationForm();

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roles = form.getValues("roles");
    handleSecondStepSubmit(roles);
  };

  const handleBackToFirstStep = () => {
    form.setValue("roles", []);
    // Reset to first step without losing user data
    // You might want to implement a different approach based on your requirements
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 rounded-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            ایجاد کاربر جدید
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            برای ایجاد کاربر جدید، لطفاً اطلاعات زیر را با دقت تکمیل کنید. تمامی
            فیلدهای ضروری باید پر شوند.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 space-x-reverse">
            <div
              className={`flex items-center ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {currentStep > 1 ? <CheckCircle size={16} /> : "1"}
              </div>
              <span className="mr-2 text-sm font-medium">اطلاعات شخصی</span>
            </div>

            <div
              className={`w-16 h-1 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {currentStep > 2 ? <CheckCircle size={16} /> : "2"}
              </div>
              <span className="mr-2 text-sm font-medium">انتخاب نقش‌ها</span>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <Form {...form} key={resetKey}>
            {currentStep === 1 ? (
              <form
                onSubmit={form.handleSubmit(handleFirstStepSubmit)}
                className="p-6 md:p-8"
              >
                {/* Personal Information Section */}
                <FormSection
                  title={FORM_SECTIONS.PERSONAL.title}
                  description={FORM_SECTIONS.PERSONAL.description}
                  columns={2}
                  className="mb-8"
                >
                  <SmartInput
                    control={form.control}
                    name="first_name"
                    label="نام"
                    placeholder="نام کاربر را وارد کنید"
                    icon={User}
                    required
                    validationType="persianName"
                  />
                  <SmartInput
                    control={form.control}
                    name="last_name"
                    label="نام خانوادگی"
                    placeholder="نام خانوادگی کاربر را وارد کنید"
                    icon={User}
                    required
                    validationType="persianName"
                  />
                  <SmartInput
                    control={form.control}
                    name="national_id"
                    label="کد ملی"
                    placeholder="کد ملی کاربر را وارد کنید"
                    icon={CreditCard}
                    required
                    validationType="nationalId"
                    maxLength={10}
                  />
                </FormSection>

                {/* Contact Information Section */}
                <FormSection
                  title={FORM_SECTIONS.CONTACT.title}
                  description={FORM_SECTIONS.CONTACT.description}
                  columns={1}
                  className="mb-8"
                >
                  <SmartInput
                    control={form.control}
                    name="phone_number"
                    label="شماره همراه"
                    placeholder="09012345678"
                    icon={Phone}
                    type="tel"
                    required
                    autoFormat
                    validationType="phone"
                    maxLength={11}
                  />
                </FormSection>

                {/* Submit Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertCircle size={16} />
                      <span>تمام فیلدهای علامت‌دار (*) الزامی هستند</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={20} className="animate-spin mr-2" />
                            در حال ثبت...
                          </>
                        ) : (
                          <>
                            <ArrowRight size={20} className="mr-2" />
                            ادامه و انتخاب نقش‌ها
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 md:p-8">
                {/* Role Selection Section */}
                <FormSection
                  title={FORM_SECTIONS.ROLES.title}
                  description={FORM_SECTIONS.ROLES.description}
                  columns={1}
                  className="mb-8"
                >
                  <form onSubmit={handleRoleSubmit}>
                    <EnhancedRoleSelector
                      selectedRoles={form.watch("roles")}
                      onRolesChange={(roles) => form.setValue("roles", roles)}
                      isLoading={isLoading}
                    />
                  </form>
                </FormSection>

                {/* Navigation Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertCircle size={16} />
                      <span>حداقل یک نقش باید انتخاب شود</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            {HELP_GUIDE.title}
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
            {HELP_GUIDE.sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{section.title}</h4>
                <ul className="space-y-1 list-disc list-inside">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserRegistrationForm;
