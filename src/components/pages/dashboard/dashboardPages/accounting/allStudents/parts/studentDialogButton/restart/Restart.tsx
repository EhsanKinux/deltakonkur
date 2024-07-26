import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IFormattedStudentAdvisor } from "../../interfaces";
import { IRestartStudent } from "@/lib/apis/accounting/interface";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";

const restartInput = () =>
  z.object({
    day: z.string(),
  });
const Restart = ({ rowData }: { rowData: IFormattedStudentAdvisor }) => {
  const formSchema = restartInput();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: "30",
    },
  });
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const { resetStudent } = useAccounting(); // Get the resetStudent function

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const now = new Date();
      const expireDate = new Date(now);
      expireDate.setDate(expireDate.getDate() + parseInt(data.day, 10));

      if (!rowData?.stop_date) {
        setWarning("دانش‌آموز متوقف نشده است، ابتدا متوقف کنید سپس برای دانش‌آموز روز تمدید کنید.");
        return;
      }

      const body: IRestartStudent = {
        student: String(rowData?.studentId),
        advisor: String(rowData?.advisor),
        status: "active",
        solar_date_day: String(rowData?.solar_date_day),
        solar_date_month: String(rowData?.solar_date_month),
        solar_date_year: String(rowData?.solar_date_year),
        expire_date: expireDate.toISOString(),
        stop_date: String(rowData?.stop_date), // assuming no stop date in this case
      };

      await resetStudent(body);
      console.log(body);
      dialogCloseRef.current?.click(); // Close the dialog
    } catch (error) {
      console.error("Failed to reset student:", error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (warning) {
      timer = setTimeout(() => {
        setWarning(null); // Clear the warning after 5 seconds
      }, 3000);
    }

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts or warning changes
    };
  }, [warning]);

  return (
    <>
      <DialogContent className="bg-slate-100 !rounded-[10px]">
        <DialogHeader>
          <DialogTitle>تمدید دانش آموز</DialogTitle>
          <DialogDescription>مقدار تمدید روز را به عدد وارد کنید و سپس دکمه ی ثبت تمدید را بزنید</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {warning && <p className="text-red-500">{warning}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <div className={`flex justify-center flex-col w-full gap-2`}>
                    <FormLabel className="pt-2 font-bold text-slate-500">تعداد روز را اضافه کنید</FormLabel>
                    <FormControl>
                      <Input
                        id="day"
                        className="w-full text-16 placeholder:text-16 rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="form-message mt-2" />
                  </div>
                )}
              />
              <DialogFooter>
                <div className="flex justify-between items-center w-full">
                  <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2">
                    ثبت تمدید
                  </Button>
                  <DialogClose asChild>
                    <Button
                      ref={dialogCloseRef}
                      className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
                    >
                      لغو
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </>
  );
};

export default Restart;
