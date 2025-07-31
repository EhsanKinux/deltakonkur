import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn, Path, FieldValues } from "react-hook-form";
import AsyncSelect from "react-select/async";

interface ISalesManager {
  id: number;
  first_name: string;
  last_name: string;
  national_number: string;
  student_id: number;
  student_name?: string;
  student_last_name?: string;
  created_at?: string;
}

type OptionType = {
  value: string;
  label: string;
};

const { accessToken } = authStore.getState();

const fetchSalesManagers = async (inputValue: string, page: number) => {
  try {
    const response = await axios.get<{ results: ISalesManager[] }>(
      `${BASE_API_URL}api/sales/sales-managers/`,
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

type SelectSalesManagerProps<T extends FieldValues = FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
};

const SelectSalesManager = <T extends FieldValues = FieldValues>({
  form,
  name,
}: SelectSalesManagerProps<T>) => {
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
        <FormItem className="flex flex-col rounded-xl w-full">
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
                value={
                  form.watch(name)
                    ? options.find(
                        (option) => option.value === form.watch(name)
                      )
                    : null
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
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "primary75"
                      : "rgb(148, 163, 184)",

                    borderRadius: "8px",
                    fontSize: "14px",
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                    borderRadius: 8,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  }),
                  menuList: (base) => ({
                    ...base,
                    backgroundColor: "#fff",
                    maxHeight: 250,
                    overflowY: "auto",
                    padding: 0,
                    borderRadius: 8,
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
