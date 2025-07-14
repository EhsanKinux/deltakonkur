import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import AsyncSelect from "react-select/async";

interface ISalesManager {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

type OptionType = {
  value: string;
  label: string;
};

type FormValues = any;

const { accessToken } = authStore.getState();

const fetchSalesManagers = async (inputValue: string, page: number) => {
  try {
    const response = await axios.get<{ results: ISalesManager[] }>(
      `${BASE_API_URL}api/management/sales-managers/`,
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

    return response.data.results.map((manager) => ({
      value: String(manager.id),
      label: `${manager.first_name} ${manager.last_name}`,
    }));
  } catch (error) {
    console.error("Error fetching sales managers:", error);
    return [];
  }
};

const SelectSalesManager = ({
  form,
  name = "sales_manager",
}: {
  form: UseFormReturn<FormValues>;
  name?: string;
  label?: string;
}) => {
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // بارگذاری داده‌های اولیه هنگام رندر اولیه
  useEffect(() => {
    const loadInitialOptions = async () => {
      setIsLoading(true);
      const managers = await fetchSalesManagers("", 1);
      setOptions((prevOptions) => [...prevOptions, ...managers]);
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
    fetchSalesManagers(inputValue, 1).then((managers) => {
      setOptions(managers);
      callback(managers);
      setIsLoading(false);
    });
  };

  const fetchMoreOnScroll = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const moreManagers = await fetchSalesManagers(searchQuery, nextPage);
    setOptions((prevOptions) => [...prevOptions, ...moreManagers]);
    setPage(nextPage);
    setIsLoading(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="flex flex-col rounded-xl w-full p-2">
          <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                loadOptions={(inputValue, callback) =>
                  loadOptions(inputValue, callback)
                }
                defaultOptions={options}
                cacheOptions
                placeholder="انتخاب مسئول فروش"
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

export default SelectSalesManager;
