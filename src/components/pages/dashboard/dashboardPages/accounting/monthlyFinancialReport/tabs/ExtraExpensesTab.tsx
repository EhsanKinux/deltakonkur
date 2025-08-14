import React from "react";
import ExtraExpensesManager from "../ExtraExpensesManager";

interface ExtraExpensesTabProps {
  selectedYear: number;
  selectedMonth: number;
  onDataChange?: () => void;
}

const ExtraExpensesTab: React.FC<ExtraExpensesTabProps> = ({
  selectedYear,
  selectedMonth,
  onDataChange,
}) => {
  return (
    <div>
      <ExtraExpensesManager
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onDataChange={onDataChange}
      />
    </div>
  );
};

export default ExtraExpensesTab;
