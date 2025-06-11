import { Button } from "@/components/ui/button";
import { IJsonData } from "@/functions/hooks/accountingList/interface";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
import { useState } from "react";
import { User, Eye, Briefcase } from "lucide-react"; // آیکون‌های مناسب

interface ITransformedData {
  paymentID: number;
  fromAccount: string;
  toAccount: string;
  amount: string;
  firstName: string;
  lastName: string;
}

const managementReports = () => {
  const { getExelInfo, getTestExelInfo } = useAccounting();
  const [loading, setLoading] = useState(false);

  const getCurrentShamsiDate = () => {
    const today = new Date().toISOString();
    return convertToShamsi2(today);
  };

  const transformData = (data: IJsonData[]): ITransformedData[] => {
    return data.map((item, index) => ({
      fromAccount: item.from_account,
      toAccount: item.to_account,
      amount: item.amount,
      paymentID: 123 + index,
      firstName: item.first_name,
      lastName: item.last_name,
    }));
  };

  const generateExcel = async (data: ITransformedData[], filename: string) => {
    const { utils, writeFile } = await import(
      "../parts/ExelXLSX/SheetJSWrapper"
    );
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, filename);
  };

  const handleFetchAndGenerate = async (
    fetchFunction: () => Promise<IJsonData[]>,
    filename: string
  ) => {
    try {
      setLoading(true);
      const data = await fetchFunction();
      if (data && data.length > 0) {
        const transformedData = transformData(data);
        await generateExcel(transformedData, filename);
      } else {
        console.warn("No data available to generate Excel file");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { name: "مشاوران", icon: <User size={32} />, prefix: "Consultant" },
    { name: "ناظران", icon: <Eye size={32} />, prefix: "Supervisor" },
    { name: "مسئول فروش", icon: <Briefcase size={32} />, prefix: "Sales" },
  ];

  return (
    <div>
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">
        گزارش گیری
      </h1>
      <div className="flex flex-col items-center justify-center lg:flex-row xl:items-start gap-8 p-8 mt-6 shadow-sidebar bg-slate-100 rounded-xl h-full">
        {roles.map((role) => (
          <div
            key={role.name}
            className="flex flex-col items-center gap-4 border  p-5 rounded-xl"
          >
            <div className="flex flex-col items-center gap-2">
              {role.icon}
              <span className="text-lg font-semibold">{role.name}</span>
            </div>

            <div className="flex flex-col gap-2 mt-2 w-36">
              <Button
                disabled={loading}
                onClick={() =>
                  handleFetchAndGenerate(
                    getTestExelInfo,
                    `${role.prefix}_Test_${getCurrentShamsiDate()}.xlsx`
                  )
                }
                className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl"
              >
                گزارشگیری تستی
              </Button>
              <Button
                disabled={loading}
                onClick={() =>
                  handleFetchAndGenerate(
                    getExelInfo,
                    `${role.prefix}_${getCurrentShamsiDate()}.xlsx`
                  )
                }
                className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl"
              >
                گزارشگیری
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default managementReports;
