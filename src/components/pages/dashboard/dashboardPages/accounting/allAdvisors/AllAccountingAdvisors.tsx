import { useAccounting } from "@/functions/hooks/accountingList/useAccounting";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

const AllAccountingAdvisors = () => {
  const { getExelInfo, getTestExelInfo, jsonTestData, jsonData, setJsonTestData, setJsonData } = useAccounting();

  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const headers = [
    { label: "نام", key: "first_name" },
    { label: "نام خانوادگی", key: "last_name" },
    { label: "به شماره حساب", key: "to_account" },
    { label: "از شماره حساب", key: "from_account" },
    { label: "مقدار", key: "amount" },
  ];

  const getCurrentShamsiDate = () => {
    const today = new Date().toISOString();
    return convertToShamsi2(today);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getExelInfo();
        await getTestExelInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setTestLoading(false);
      }
    };

    fetchData();
  }, [getExelInfo, getTestExelInfo]);

  useEffect(() => {
    if (jsonTestData && jsonTestData.length > 0 && !isModified) {
      const modifiedData = jsonTestData.map((item) => ({
        ...item,
        to_account: `'${item.to_account}`,
        from_account: `'${item.from_account}`,
        amount: String(item.amount),
      }));
      setJsonTestData(modifiedData);
      setIsModified(true);
    }
  }, [jsonTestData, isModified, setJsonTestData]);

  useEffect(() => {
    if (jsonData && jsonData.length > 0 && !isModified) {
      const modifiedData = jsonData.map((item) => ({
        ...item,
        to_account: `'${item.to_account}`,
        from_account: `'${item.from_account}`,
        amount: String(item.amount),
      }));
      setJsonData(modifiedData);
      setIsModified(true);
    }
  }, [jsonTestData, isModified, setJsonTestData]);

  return (
    <div className="flex justify-center items-center gap-3 p-16 mt-4 shadow-sidebar bg-slate-100 rounded-xl">
      {!testLoading && (
        <CSVLink
          headers={headers}
          data={jsonTestData || []}
          filename={`TestAccountant_${getCurrentShamsiDate()}.csv`}
          style={{ textDecoration: "none", color: "#fff" }}
          className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl p-2"
        >
          گزارشگیری تستی
        </CSVLink>
      )}

      {!loading && (
        <CSVLink
          headers={headers}
          data={jsonData || []}
          filename={`Accountant_${getCurrentShamsiDate()}.csv`}
          style={{ textDecoration: "none", color: "#000" }}
          className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl p-2"
        >
          گزارشگیری
        </CSVLink>
      )}
    </div>
  );
};

export default AllAccountingAdvisors;
