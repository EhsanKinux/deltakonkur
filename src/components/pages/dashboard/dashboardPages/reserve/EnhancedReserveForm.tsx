import { Button } from "@/components/ui/button";
import EnhancedSelect from "@/components/ui/EnhancedSelect";
import { Form } from "@/components/ui/form";
import FormSection from "@/components/ui/FormSection";
import SmartInput from "@/components/ui/SmartInput";
import {
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Loader2,
  Phone,
  School,
  User,
  Users,
} from "lucide-react";
import PlansType from "./_components/down/PlansType";
import SelectSalesManager from "./_components/sales/SelectSalesManager";
import {
  FIELD_OPTIONS,
  FORM_SECTIONS,
  GRADE_OPTIONS,
  HELP_GUIDE,
} from "./constants/formOptions";
import { useReserveForm } from "./hooks/useReserveForm";

const EnhancedReserveForm = () => {
  const { form, isLoading, onSubmit, resetKey } = useReserveForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 rounded-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            ثبت نام دانش آموز جدید
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            برای ثبت نام دانش آموز جدید، لطفاً اطلاعات زیر را با دقت تکمیل کنید.
            تمامی فیلدهای ضروری باید پر شوند.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <Form {...form} key={resetKey}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
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
                  placeholder="نام دانش آموز را وارد کنید"
                  icon={User}
                  required
                  validationType="persianName"
                />
                <SmartInput
                  control={form.control}
                  name="last_name"
                  label="نام خانوادگی"
                  placeholder="نام خانوادگی دانش آموز را وارد کنید"
                  icon={User}
                  required
                  validationType="persianName"
                />
                <SmartInput
                  control={form.control}
                  name="school"
                  label="نام مدرسه"
                  placeholder="نام مدرسه را وارد کنید"
                  icon={School}
                  required
                />
              </FormSection>

              {/* Contact Information Section */}
              <FormSection
                title={FORM_SECTIONS.CONTACT.title}
                description={FORM_SECTIONS.CONTACT.description}
                columns={2}
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
                <SmartInput
                  control={form.control}
                  name="home_phone"
                  label="شماره تلفن منزل"
                  placeholder="02112345678"
                  icon={Phone}
                  type="tel"
                />
                <SmartInput
                  control={form.control}
                  name="parent_phone"
                  label="شماره همراه والدین"
                  placeholder="09012345678"
                  icon={Phone}
                  type="tel"
                  required
                  autoFormat
                  validationType="phone"
                  maxLength={11}
                />
              </FormSection>

              {/* Academic Information Section */}
              <FormSection
                title={FORM_SECTIONS.ACADEMIC.title}
                description={FORM_SECTIONS.ACADEMIC.description}
                columns={2}
                className="mb-8"
              >
                <EnhancedSelect
                  control={form.control}
                  name="field"
                  label="رشته تحصیلی"
                  placeholder="رشته تحصیلی را انتخاب کنید"
                  options={FIELD_OPTIONS}
                  icon={GraduationCap}
                  required
                />
                <EnhancedSelect
                  control={form.control}
                  name="grade"
                  label="مقطع تحصیلی"
                  placeholder="مقطع تحصیلی را انتخاب کنید"
                  options={GRADE_OPTIONS}
                  icon={School}
                  required
                />
              </FormSection>

              {/* Financial Information Section */}
              <FormSection
                title={FORM_SECTIONS.FINANCIAL.title}
                description={FORM_SECTIONS.FINANCIAL.description}
                columns={2}
                className="mb-3"
              >
                <PlansType
                  name="package_price"
                  control={form.control}
                  label="هزینه بسته* (به ریال)"
                />
                <SelectSalesManager
                  form={form}
                  name="sales_manager"
                  label="انتخاب مسئول فروش"
                  key={resetKey}
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
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin mr-2" />
                          در حال ثبت...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} className="mr-2" />
                          ثبت نام
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            {HELP_GUIDE.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
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

export default EnhancedReserveForm;
