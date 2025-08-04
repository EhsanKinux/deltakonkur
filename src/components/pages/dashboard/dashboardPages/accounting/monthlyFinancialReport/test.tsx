import React from "react";
import MonthlyFinancialReport from "./index";

const TestComponent: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">تست صفحه حساب و کتاب ماهیانه</h1>
      <MonthlyFinancialReport />
    </div>
  );
};

export default TestComponent;

// Test cases for manual testing
export const testCases = {
  // Test data loading
  testDataLoading: () => {
    console.log("Testing data loading...");
    // This would be used in actual unit tests
  },

  // Test month selection
  testMonthSelection: () => {
    console.log("Testing month selection...");
    // This would be used in actual unit tests
  },

  // Test year selection
  testYearSelection: () => {
    console.log("Testing year selection...");
    // This would be used in actual unit tests
  },

  // Test error handling
  testErrorHandling: () => {
    console.log("Testing error handling...");
    // This would be used in actual unit tests
  },

  // Test export functionality
  testExport: () => {
    console.log("Testing export functionality...");
    // This would be used in actual unit tests
  },
};
