import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Advisor } from "@/lib/store/types";
import { cn } from "@/lib/utils/cn/cn";
import { Check, ChevronsUpDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

const SearchAdvisors = ({
  form,
  advisors,
}: {
  form: UseFormReturn<
    {
      //   id: string;
      first_name: string;
      last_name: string;
      content: string;
    },
    undefined
  >;
  advisors: Advisor[];
}) => {
  return (
    <FormField
      control={form.control}
      name="first_name"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>مشاور</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  // variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between rounded-xl border border-slate-400",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? advisors.find((advisor) => advisor.first_name === field.value)?.first_name +
                      " " +
                      advisors.find((advisor) => advisor.first_name === field.value)?.last_name
                    : "انتخاب مشاور"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-slate-100 shadow-form rounded-xl">
              <Command>
                <CommandInput placeholder="جستجوی مشاور..." className="text-gray-400" />
                <CommandList>
                  <CommandEmpty>هیچ مشاوری یافت نشد!</CommandEmpty>
                  <CommandGroup>
                    {advisors.map((advisor) => (
                      <CommandItem
                        value={advisor.first_name + " " + advisor.last_name}
                        key={advisor.id}
                        onSelect={() => {
                          form.setValue("first_name", advisor.first_name);
                          form.setValue("last_name", advisor.last_name);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            advisor.first_name === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {advisor.first_name + " " + advisor.last_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* <FormDescription>مشاور خود را انتخاب کنید.</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SearchAdvisors;
