import React from "react";
import FinancialRecordsManager from "../FinancialRecordsManager";

interface FinancialRecordsTabProps {
  selectedYear: number;
  selectedMonth: number;
}

const FinancialRecordsTab: React.FC<FinancialRecordsTabProps> = ({
  selectedYear,
  selectedMonth,
}) => {
  return (
    <div>
      <FinancialRecordsManager
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default FinancialRecordsTab;
