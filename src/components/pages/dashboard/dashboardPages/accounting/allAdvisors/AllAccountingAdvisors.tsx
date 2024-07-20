import { Button } from "@/components/ui/button";
import { IJsonData } from "@/functions/hooks/accountingList/interface";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
import { useState } from "react";

const AllAccountingAdvisors = () => {
  const { getExelInfo, getTestExelInfo } = useAccounting();

  const [loading, setLoading] = useState(false);

  const getCurrentShamsiDate = () => {
    const today = new Date().toISOString();
    return convertToShamsi2(today);
  };

  const generateExcel = async (data: IJsonData[], filename: string) => {
    const { utils, writeFile } = await import("../allAdvisors/parts/ExelXLSX/SheetJSWrapper");
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, filename);
  };

  const handleFetchAndGenerate = async (
    fetchFunction: () => Promise<IJsonData[]>,
    // setData: (data: IJsonData[]) => void,
    filename: string
  ) => {
    try {
      setLoading(true);
      const data = await fetchFunction();
      if (data && data.length > 0) {
        // setData(data); // Update state if needed for future use
        await generateExcel(data, filename);
      } else {
        console.warn("No data available to generate Excel file");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
      {!loading && (
        <Button
          onClick={() => {
            handleFetchAndGenerate(
              getTestExelInfo,
              // () => jsonTestData,
              `TestAccountant_${getCurrentShamsiDate()}.xlsx`
            );
          }}
          className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl p-2"
        >
          گزارشگیری تستی
        </Button>
      )}

      {!loading && (
        <Button
          onClick={() =>
            handleFetchAndGenerate(
              getExelInfo,
              // () => jsonData,
              `Accountant_${getCurrentShamsiDate()}.xlsx`
            )
          }
          className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl p-2"
        >
          گزارشگیری
        </Button>
      )}
    </div>
  );
};

export default AllAccountingAdvisors;
