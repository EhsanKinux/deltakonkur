import { Button } from "@/components/ui/button";
import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
// import { utils, write } from "xlsx";
// import { write } from "xlsx";
import { saveAs } from "file-saver";
import { useEffect } from "react";
const AllAccountingAdvisors = () => {
  const { getExelInfo, getTestExelInfo, jsonTestData, jsonData } = useAccounting();
  
  const exportToExcel = async (data: any[], fileName: string | undefined) => {
    const XLSX = await import("../allAdvisors/parts/EXEL/SheetJSWriteWrapper");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentShamsiDate = getCurrentShamsiDate();
    const fullFileName = `${fileName}_${currentShamsiDate}.xlsx`;
    saveAs(dataBlob, fullFileName);
  };

  useEffect(() => {
    if (jsonData && jsonData.length > 0) {
      exportToExcel(jsonData, "Accountant");
    }
  }, [jsonData, getExelInfo]);

  useEffect(() => {
    if (jsonTestData && jsonTestData.length > 0) {
      exportToExcel(jsonTestData, "TestAccountant");
    }
  }, [jsonTestData, getTestExelInfo]);

  const handleExelData = async () => {
    try {
      await getExelInfo();
      // jsonData will be updated, and useEffect will handle the export
    } catch (error) {
      console.error("Error fetching Exel data:", error);
    }
  };

  const handleTestExelData = async () => {
    try {
      await getTestExelInfo();
      // jsonTestData will be updated, and useEffect will handle the export
    } catch (error) {
      console.error("Error fetching test Exel data:", error);
    }
  };

  const getCurrentShamsiDate = () => {
    const today = new Date().toISOString();
    return convertToShamsi2(today);
  };



  return (
    <div className="flex justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
      <Button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2" onClick={handleTestExelData}>
        گزارشگیری تستی
      </Button>
      <Button
        className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2"
        onClick={handleExelData}
      >
        گزارشگیری
      </Button>
    </div>
  );
};

export default AllAccountingAdvisors;
