import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";

type OptionType = {
  value: string;
  label: string;
};

type FormData = {
  id: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  school: string;
  phone_number: string;
  home_phone: string;
  parent_phone: string;
  field: string;
  grade: string;
  created?: string;
  advisor: string | null;
  advisor_id: string | null;
  advisor_name: string | null;
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
};

interface Advisor {
  id: number;
  first_name: string;
  last_name: string;
}

const { accessToken } = authStore.getState();

const fetchAdvisors = async (inputValue: string, page: number) => {
  try {
    const response = await axios.get<{ results: Advisor[] }>(
      `${BASE_API_URL}api/advisor/advisors/`,
      {
        params: {
          search: inputValue,
          page: page,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.results.map((advisor) => ({
      value: String(advisor.id),
      label: `${advisor.first_name} ${advisor.last_name}`,
    }));
  } catch (error) {
    console.error("Error fetching advisors:", error);
    return [];
  }
};

// تابع کمکی برای حذف گزینه‌های تکراری بر اساس value
const uniqueOptions = (options: OptionType[]) => {
  const seen = new Set();
  return options.filter((opt) => {
    if (seen.has(opt.value)) return false;
    seen.add(opt.value);
    return true;
  });
};

const SelectStudentAdvisor = ({
  form,
  student,
}: {
  form: any;
  student: FormData | null;
}) => {
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // اضافه کردن مشاور فعلی به options اگر وجود داشته باشد
  useEffect(() => {
    if (student?.advisor_id && student.advisor_name) {
      const currentAdvisor = {
        value: String(student.advisor_id),
        label: student.advisor_name,
      };
      setOptions((prevOptions) => {
        // اگر قبلاً وجود نداشت اضافه کن
        const exists = prevOptions.some(
          (opt) => opt.value === currentAdvisor.value
        );
        if (!exists) {
          return uniqueOptions([currentAdvisor, ...prevOptions]);
        }
        return prevOptions;
      });
    }
  }, [student]);

  // بارگذاری داده‌های اولیه هنگام رندر اولیه
  useEffect(() => {
    const loadInitialOptions = async () => {
      setIsLoading(true);
      const advisors = await fetchAdvisors("", 1);
      setOptions((prevOptions) => uniqueOptions([...prevOptions, ...advisors]));
      setIsLoading(false);
    };

    loadInitialOptions();
  }, []);

  const loadOptions = (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => {
    setIsLoading(true);
    setSearchQuery(inputValue);
    setPage(1);
    fetchAdvisors(inputValue, 1).then((advisors) => {
      const newOptions = uniqueOptions(advisors);
      setOptions(newOptions);
      callback(newOptions);
      setIsLoading(false);
    });
  };

  const fetchMoreOnScroll = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const moreAdvisors = await fetchAdvisors(searchQuery, nextPage);
    setOptions((prevOptions) =>
      uniqueOptions([...prevOptions, ...moreAdvisors])
    );
    setPage(nextPage);
    setIsLoading(false);
  };

  return (
    <FormField
      control={form.control}
      name="advisor"
      render={() => (
        <FormItem className="flex flex-col bg-slate-100 rounded-xl">
          <FormLabel className="pt-2 font-bold text-slate-500">
            تعیین مشاور
          </FormLabel>
          <Controller
            name="advisor"
            control={form.control as any}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                loadOptions={(inputValue, callback) =>
                  loadOptions(inputValue, callback)
                }
                defaultOptions={options}
                cacheOptions
                placeholder="انتخاب مشاور"
                classNamePrefix="react-select"
                onMenuScrollToBottom={fetchMoreOnScroll}
                isLoading={isLoading}
                loadingMessage={() => "در حال بارگذاری..."}
                value={
                  options.find((option) => option.value === field.value) || null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption?.value || "");
                }}
                onInputChange={(inputValue) => {
                  setSearchQuery(inputValue);
                }}
                onBlur={() => {
                  setSearchQuery("");
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "primary75"
                      : "rgb(148, 163, 184)",
                    backgroundColor: "rgb(241, 245, 249)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }),
                }}
              />
            )}
          />
          <FormMessage className="form-message mt-2 pr-5" />
        </FormItem>
      )}
    />
  );
};

export default SelectStudentAdvisor;
