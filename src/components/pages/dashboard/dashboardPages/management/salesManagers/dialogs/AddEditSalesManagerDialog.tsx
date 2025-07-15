import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ISalesManager } from "../interface";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { BASE_API_URL } from "@/lib/variables/variables";
import { authStore } from "@/lib/store/authStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
} from "@/components/ui/form";

interface AddEditSalesManagerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    manager: Omit<
      ISalesManager,
      "id" | "student_name" | "student_last_name" | "created_at"
    >
  ) => void;
  editRow: ISalesManager | null;
}

// تعریف نوع برای گزینه دانش‌آموز
interface StudentOption {
  value: number;
  label: string;
}
interface Student {
  id: number;
  first_name: string;
  last_name: string;
  national_number?: string;
}

const salesManagerSchema = z.object({
  name: z.string().min(1, { message: "نام را وارد کنید" }),
  national_number: z
    .string()
    .regex(/^\d{10}$/, { message: "کد ملی باید 10 رقم باشد" }),
  student_id: z.number().min(1, { message: "دانش‌آموز را انتخاب کنید" }),
});
type SalesManagerFormType = z.infer<typeof salesManagerSchema>;

const { accessToken } = authStore.getState();

const fetchStudents = async (
  inputValue: string,
  page: number
): Promise<StudentOption[]> => {
  try {
    const res = await axios.get(`${BASE_API_URL}api/register/students`, {
      params: { search: inputValue, page },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.results.map((student: Student) => ({
      value: student.id,
      label: `${student.first_name} ${student.last_name} - ${
        student.national_number || ""
      }`,
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

const AddEditSalesManagerDialog = ({
  open,
  onClose,
  onSave,
  editRow,
}: AddEditSalesManagerDialogProps) => {
  const [studentOption, setStudentOption] = useState<StudentOption | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<StudentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<SalesManagerFormType>({
    resolver: zodResolver(salesManagerSchema),
    defaultValues: {
      name: editRow?.name || "",
      national_number: editRow?.national_number || "",
      student_id: editRow?.student_id || 0,
    },
  });

  useEffect(() => {
    if (editRow) {
      form.reset({
        name: editRow.name,
        national_number: editRow.national_number,
        student_id: editRow.student_id,
      });
      setStudentOption(
        editRow.student_id
          ? {
              value: editRow.student_id,
              label: `${editRow.student_name || ""} ${
                editRow.student_last_name || ""
              }`,
            }
          : null
      );
    } else {
      form.reset({ name: "", national_number: "", student_id: 0 });
      setStudentOption(null);
    }
  }, [editRow, open]);

  // بارگذاری داده‌های اولیه هنگام رندر اولیه
  useEffect(() => {
    const loadInitialOptions = async () => {
      setIsLoading(true);
      const students = await fetchStudents("", 1);
      setOptions(students);
      setIsLoading(false);
    };
    loadInitialOptions();
  }, []);

  const loadOptions = (
    inputValue: string,
    callback: (options: StudentOption[]) => void
  ) => {
    setIsLoading(true);
    setSearchQuery(inputValue);
    setPage(1);
    fetchStudents(inputValue, 1).then((students) => {
      setOptions(students);
      callback(students);
      setIsLoading(false);
    });
  };

  const fetchMoreOnScroll = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const moreStudents = await fetchStudents(searchQuery, nextPage);
    setOptions((prevOptions) => [...prevOptions, ...moreStudents]);
    setPage(nextPage);
    setIsLoading(false);
  };

  const handleSubmit = (data: SalesManagerFormType) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !rounded-2xl md:h-fit flex flex-col items-center max-h-[90vh] w-full max-w-md overflow-y-auto p-4">
        <DialogHeader className="w-full">
          <DialogTitle className="text-lg md:text-xl font-bold mb-1">
            {editRow ? "ویرایش مسئول فروش" : "افزودن مسئول فروش"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1 mb-2">
            لطفاً اطلاعات مسئول فروش را با دقت وارد کنید. همه فیلدها الزامی
            هستند.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5 mt-2 w-full"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="font-semibold text-gray-700 mb-1">
                    نام مسئول فروش
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثلاً علی محمدی"
                      className="rounded-xl border border-slate-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="national_number"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="font-semibold text-gray-700 mb-1">
                    کد ملی
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="مثلاً 1234567890"
                      className="rounded-xl border border-slate-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="font-semibold text-gray-700 mb-1">
                    دانش‌آموز مرتبط
                  </FormLabel>
                  <AsyncSelect
                    loadOptions={loadOptions}
                    defaultOptions={options}
                    cacheOptions
                    value={
                      studentOption ||
                      (field.value
                        ? options.find((option) => option.value === field.value)
                        : null)
                    }
                    onChange={(option) => {
                      field.onChange(option?.value || 0);
                      setStudentOption(option as StudentOption | null);
                    }}
                    placeholder="انتخاب دانش‌آموز"
                    isClearable
                    onMenuScrollToBottom={fetchMoreOnScroll}
                    isLoading={isLoading}
                    loadingMessage={() => "در حال بارگذاری..."}
                    onInputChange={(inputValue) => {
                      setSearchQuery(inputValue);
                    }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused
                          ? "primary75"
                          : "rgb(148, 163, 184)",
                        backgroundColor: "rgb(241, 245, 249)",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }),
                    }}
                  />
                  <FormMessage className="text-red-500 text-xs mt-1 font-medium" />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-row gap-2 justify-between w-full mt-2">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-base py-2 rounded-xl font-bold shadow-md transition-all duration-200"
              >
                {editRow ? "ذخیره تغییرات" : "افزودن"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-base py-2 border border-gray-400 rounded-xl font-bold shadow-sm transition-all duration-200"
                onClick={onClose}
              >
                انصراف
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditSalesManagerDialog;
