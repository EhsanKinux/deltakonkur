import { Controller, UseFormReturn } from "react-hook-form";
import AsyncSelect from "react-select/async";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import axios from "axios";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";

type OptionType = {
  value: string;
  label: string;
};

type FormValues = {
  id: string;
  first_name: string;
  last_name: string;
  school: string;
  phone_number: string;
  home_phone: string;
  parent_phone: string;
  field: string;
  grade: string;
  created: string;
  package_price: string;
  advisor: string;
  supervisor: string;
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
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
  package_price?: string;
  advisor: string | null;
  advisor_id: string | null;
  advisor_name: string | null;
  supervisor: string | null;
  supervisor_id: string | null;
  supervisor_name: string | null;
};

interface supervisor {
  id: number;
  first_name: string;
  last_name: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

const { accessToken } = authStore.getState();

const fetchSupervisors = async (inputValue: string, page: number) => {
  try {
    const response = await axios.get<{ results: supervisor[] }>(
      `${BASE_API_URL}api/supervisor/profile/`,
      {
        params: {
          supervisor: inputValue,
          page: page,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.results.map((supervisor) => ({
      value: String(supervisor.id),
      label: `${supervisor.user.first_name} ${supervisor.user.last_name}`,
    }));
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return [];
  }
};

const SelectStudentSupervisor = ({
  form,
  student,
}: {
  form: UseFormReturn<FormValues>;
  student: FormData | null;
}) => {
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // اضافه کردن مشاور فعلی به options اگر وجود داشته باشد
  useEffect(() => {
    if (student?.supervisor_id && student.supervisor_name) {
      const currentSupervisor = {
        value: String(student.supervisor_id),
        label: student.supervisor_name,
      };
      setOptions((prevOptions) => [currentSupervisor, ...prevOptions]);
    }
  }, [student]);

  // بارگذاری داده‌های اولیه هنگام رندر اولیه
  useEffect(() => {
    const loadInitialOptions = async () => {
      setIsLoading(true);
      const supervisors = await fetchSupervisors("", 1);
      setOptions((prevOptions) => [...prevOptions, ...supervisors]);
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
    fetchSupervisors(inputValue, 1).then((supervisors) => {
      setOptions(supervisors);
      callback(supervisors);
      setIsLoading(false);
    });
  };

  const fetchMoreOnScroll = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const moreSupervisors = await fetchSupervisors(searchQuery, nextPage);
    setOptions((prevOptions) => [...prevOptions, ...moreSupervisors]);
    setPage(nextPage);
    setIsLoading(false);
  };

  return (
    <FormField
      control={form.control}
      name="supervisor"
      render={() => (
        <FormItem className="flex flex-col bg-slate-100 rounded-xl">
          <FormLabel className="pt-2 font-bold text-slate-500">
            تعیین ناظر
          </FormLabel>
          <Controller
            name="supervisor"
            control={form.control}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                loadOptions={(inputValue, callback) =>
                  loadOptions(inputValue, callback)
                }
                defaultOptions={options}
                cacheOptions
                placeholder="انتخاب ناظر"
                classNamePrefix="react-select"
                onMenuScrollToBottom={fetchMoreOnScroll}
                isLoading={isLoading}
                loadingMessage={() => "در حال بارگذاری..."}
                value={options.find((option) => option.value === field.value)}
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

export default SelectStudentSupervisor;
