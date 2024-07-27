import { Input } from "@/components/ui/input";
import { Advisor } from "@/lib/store/types";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import Select, { MultiValue } from "react-select";

type Option = {
  value: string;
  label: string;
};

type SelectedAdvisor = {
  advisor: string;
  subject: string;
};

const SearchAdvisors = ({
  form,
  advisors,
}: {
  form: UseFormReturn<
    Record<
      string,
      {
        advisor: string;
        subject: string;
      }
    >,
    undefined
  >;
  advisors: Advisor[];
}) => {
  const [selectedAdvisors, setSelectedAdvisors] = useState<SelectedAdvisor[]>([]);

  const options: Option[] = advisors.map((adv) => ({
    value: String(adv.id),
    label: `${adv.first_name} ${adv.last_name}`,
  }));

  const handleChange = (newValue: MultiValue<Option>) => {
    const selectedOptions = newValue as Option[];
    const newSelectedAdvisors = selectedOptions.map((option) => ({
      advisor: option.value,
      subject: "",
    }));
    setSelectedAdvisors(newSelectedAdvisors);
    newSelectedAdvisors.forEach((adv, index) => {
      form.setValue(`${index}.advisor`, String(adv.advisor));
      form.setValue(`${index}.subject`, "");
    });
  };

  const handleSubjectChange = (index: number, newSubject: string) => {
    const updatedAdvisors = [...selectedAdvisors];
    updatedAdvisors[index].subject = newSubject;
    setSelectedAdvisors(updatedAdvisors);
    form.setValue(`${index}.subject`, newSubject);
  };

  return (
    <div className="w-full flex items-end flex-col md:flex-row gap-4">
      <div className="w-full flex flex-col gap-5 items-end">
        <span className="w-full">مشاور و استاد گرامی،</span>
        <div className="w-full flex items-end flex-col md:flex-row gap-4">
          <div className="w-full flex-col inline-flex">
            <label className="font-light">انتخاب مشاور</label>
            <Select
              options={options}
              value={selectedAdvisors.map((advisor) => ({
                value: String(advisor.advisor),
                label:
                  advisors.find((adv) => String(adv.id) === String(advisor.advisor))?.first_name +
                  " " +
                  advisors.find((adv) => String(adv.id) === String(advisor.advisor))?.last_name,
              }))}
              onChange={handleChange}
              isMulti
              placeholder="جستجوی مشاوران"
              isSearchable={true}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? "primary75" : "rgb(148, 163, 184)",
                  backgroundColor: "rgb(241, 245, 249)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }),
              }}
            />
          </div>
        </div>
        {selectedAdvisors.map((advisor, index) => (
          <div key={index} className="w-full flex-col inline-flex">
            <label className="font-light">
              موضوع برای {advisors.find((adv) => String(adv.id) === advisor.advisor)?.first_name}
            </label>
            <Input
              name={`advisor${index}`}
              type="text"
              placeholder="موضوع"
              value={advisor.subject}
              onChange={(e) => handleSubjectChange(index, e.target.value)}
              className="text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
            />
          </div>
        ))}
        <span className="w-full">
          برای این ماه شما در نظر گرفته شده است. لطفا وویس خود را ضبط نموده و طی 5 روز آینده به واحد محتوا تحویل دهید.
        </span>
      </div>
    </div>
  );
};

export default SearchAdvisors;
