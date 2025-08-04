import { FinancialReport } from "./types";

export const sampleFinancialData: FinancialReport = {
  solar_year: 1403,
  solar_month: 7,
  total_revenue: 50000000,
  active_students_count: 50,
  prolonging_students_count: 50,
  total_costs: 35000000,
  advisor_costs: 20000000,
  supervisor_costs: 8000000,
  sales_manager_costs: 5000000,
  extra_expenses: 2000000,
  total_profit: 15000000,
  profit_margin_percentage: 30,
  revenue_details: [
    {
      student_id: 1,
      student_name: "علی احمدی",
      package_price: 1000000,
      revenue: 1000000,
    },
    {
      student_id: 2,
      student_name: "سارا محمدی",
      package_price: 1200000,
      revenue: 1200000,
    },
    {
      student_id: 3,
      student_name: "احمد رضایی",
      package_price: 800000,
      revenue: 800000,
    },
    {
      student_id: 4,
      student_name: "مریم کریمی",
      package_price: 1500000,
      revenue: 1500000,
    },
    {
      student_id: 5,
      student_name: "محمد حسینی",
      package_price: 1100000,
      revenue: 1100000,
    },
  ],
  cost_details: {
    advisor_details: [
      {
        advisor_id: 1,
        advisor_name: "دکتر احمدی",
        amount: 5000000,
        level: 3,
      },
      {
        advisor_id: 2,
        advisor_name: "دکتر محمدی",
        amount: 4500000,
        level: 2,
      },
      {
        advisor_id: 3,
        advisor_name: "دکتر رضایی",
        amount: 3500000,
        level: 2,
      },
    ],
    supervisor_details: [
      {
        supervisor_id: 1,
        supervisor_name: "مهندس کریمی",
        amount: 2000000,
        level: 2,
      },
      {
        supervisor_id: 2,
        supervisor_name: "مهندس حسینی",
        amount: 1800000,
        level: 1,
      },
    ],
    sales_manager_details: [
      {
        sales_manager_id: 1,
        sales_manager_name: "خانم احمدی",
        level: 2,
        percentage: 0.15,
        students_count: 10,
        total_earnings: 7500000,
        students_details: [
          {
            student_id: 1,
            student_name: "علی احمدی",
            package_price: 1000000,
            percentage: 0.15,
            earnings: 150000,
          },
          {
            student_id: 2,
            student_name: "سارا محمدی",
            package_price: 1200000,
            percentage: 0.15,
            earnings: 180000,
          },
        ],
      },
      {
        sales_manager_id: 2,
        sales_manager_name: "آقای رضایی",
        level: 1,
        percentage: 0.1,
        students_count: 8,
        total_earnings: 5000000,
        students_details: [
          {
            student_id: 3,
            student_name: "احمد رضایی",
            package_price: 800000,
            percentage: 0.1,
            earnings: 80000,
          },
          {
            student_id: 4,
            student_name: "مریم کریمی",
            package_price: 1500000,
            percentage: 0.1,
            earnings: 150000,
          },
        ],
      },
    ],
    extra_expenses_details: [
      {
        expense_id: 1,
        title: "اجاره دفتر",
        category: "office",
        amount: 2000000,
        date: "2024-10-15",
      },
      {
        expense_id: 2,
        title: "خرید تجهیزات",
        category: "equipment",
        amount: 500000,
        date: "2024-10-20",
      },
      {
        expense_id: 3,
        title: "هزینه اینترنت",
        category: "utilities",
        amount: 300000,
        date: "2024-10-25",
      },
    ],
  },
};
