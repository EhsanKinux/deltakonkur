export interface FinancialReport {
  solar_year: number;
  solar_month: number;
  total_revenue: string;
  active_students_count: number;
  prolonging_students_count: number;
  total_costs: string;
  advisor_costs: string;
  supervisor_costs: string;
  sales_manager_costs: string;
  extra_expenses: string;
  total_profit: string;
  profit_margin_percentage: number;
  revenue_details: Array<{
    student_id: number;
    student_name: string;
    package_price: string;
    revenue: string;
  }>;
  cost_details: {
    advisor_details: Array<{
      advisor_id: number;
      advisor_name: string;
      amount: string;
      level: number;
    }>;
    supervisor_details: Array<{
      supervisor_id: number;
      supervisor_name: string;
      amount: string;
      level: number;
    }>;
    sales_manager_details: Array<{
      sales_manager_id: number;
      sales_manager_name: string;
      level: number;
      percentage: number;
      students_count: number;
      total_earnings: string;
      students_details: Array<{
        student_id: number;
        student_name: string;
        package_price: string;
        percentage: number;
        earnings: string;
      }>;
    }>;
    extra_expenses_details: Array<{
      expense_id: number;
      title: string;
      category: string;
      amount: string;
      date: string;
    }>;
  };
}

// New interface for the financial report endpoint
export interface FinancialReportResponse {
  solar_year: number;
  solar_month: number;
  total_revenue: number;
  active_students_count: number;
  prolonging_students_count: number;
  total_costs: number;
  advisor_costs: number;
  supervisor_costs: number;
  sales_manager_costs: number;
  extra_expenses: number;
  total_profit: number;
  profit_margin_percentage: number;
  revenue_details: any[];
  cost_details: any;
}

export interface FinancialDashboard {
  summary: {
    total_extra_expenses: string;
    total_revenue: string;
    total_costs: string;
    total_profit: string;
    average_profit_margin: number;
  };
  extra_expenses: Array<{
    id: number;
    title: string;
    amount: string;
    category: string;
  }>;
  monthly_revenues: Array<{
    id: number;
    solar_year: number;
    solar_month: number;
    total_revenue: string;
  }>;
  monthly_costs: Array<{
    id: number;
    solar_year: number;
    solar_month: number;
    total_costs: string;
  }>;
  monthly_financial_records: Array<{
    id: number;
    solar_year: number;
    solar_month: number;
    total_profit: string;
    profit_margin_percentage: number;
  }>;
}

// Financial Records interfaces
export interface FinancialRecord {
  id: number;
  solar_year: number;
  solar_month: number;
  total_revenue: string;
  active_students_count: number;
  prolonging_students_count: number;
  total_costs: string;
  advisor_costs: string;
  supervisor_costs: string;
  sales_manager_costs: string;
  extra_expenses: string;
  total_profit: string;
  profit_margin_percentage: number;
  record_type: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialRecordsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FinancialRecord[];
}

// Monthly Costs interfaces
export interface MonthlyCost {
  id: number;
  solar_year: number;
  solar_month: number;
  total_costs: string;
  advisor_costs: string;
  supervisor_costs: string;
  sales_manager_costs: string;
  extra_expenses: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyCostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MonthlyCost[];
}

// Monthly Revenue interfaces
export interface MonthlyRevenue {
  id: number;
  solar_year: number;
  solar_month: number;
  total_revenue: string;
  active_students_count: number;
  prolonging_students_count: number;
  created_at: string;
  updated_at: string;
}

export interface MonthlyRevenueResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MonthlyRevenue[];
}

// Historical Data interface
export interface HistoricalData {
  id: number;
  solar_year: number;
  solar_month: number;
  total_revenue: string;
  active_students_count: number;
  prolonging_students_count: number;
  total_costs: string;
  advisor_costs: string;
  supervisor_costs: string;
  sales_manager_costs: string;
  extra_expenses: string;
  total_profit: string;
  profit_margin_percentage: number;
  record_type: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Extra Expense interfaces
export interface ExtraExpense {
  id: number;
  title: string;
  description: string;
  amount: string;
  category: string;
  date: string;
  solar_year: number;
  solar_month: number;
  created_at: string;
  updated_at: string;
}

export interface ExtraExpenseFormData {
  title: string;
  description: string;
  amount: string;
  category: string;
  date: string;
  solar_year: number;
  solar_month: number;
}

export interface ExtraExpensesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExtraExpense[];
}

// Filter interfaces
export interface ExtraExpensesFilter {
  amount_max?: string;
  amount_min?: string;
  category?: string;
  date_from?: string;
  date_to?: string;
  solar_month?: number;
  solar_year?: number;
}

export interface FinancialRecordsFilter {
  notes_search?: string;
  profit_margin_max?: number;
  profit_margin_min?: number;
  profit_max?: string;
  profit_min?: string;
  revenue_max?: string;
  revenue_min?: string;
  solar_month?: number;
  solar_year?: number;
}

export interface MonthlyCostsFilter {
  advisor_costs_max?: string;
  advisor_costs_min?: string;
  cost_max?: string;
  cost_min?: string;
  solar_month?: number;
  solar_year?: number;
}

export interface MonthlyRevenueFilter {
  revenue_max?: string;
  revenue_min?: string;
  solar_month?: number;
  solar_year?: number;
  students_max?: number;
  students_min?: number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export interface MonthlySummaryProps {
  data: FinancialReport;
}

export interface FinancialChartsProps {
  data: FinancialReport;
}

export interface FinancialDetailsProps {
  data: FinancialReport;
}

// Table Column interface
export interface TableColumn<T> {
  key: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (value: unknown, row: T) => React.ReactNode;
}

// Helper function to format numbers
export const formatNumber = (num: string | number): string => {
  const numericValue = typeof num === "string" ? parseFloat(num) : num;
  return new Intl.NumberFormat("fa-IR").format(numericValue);
};

// Persian months data
export const persianMonths = [
  { value: 1, label: "فروردین" },
  { value: 2, label: "اردیبهشت" },
  { value: 3, label: "خرداد" },
  { value: 4, label: "تیر" },
  { value: 5, label: "مرداد" },
  { value: 6, label: "شهریور" },
  { value: 7, label: "مهر" },
  { value: 8, label: "آبان" },
  { value: 9, label: "آذر" },
  { value: 10, label: "دی" },
  { value: 11, label: "بهمن" },
  { value: 12, label: "اسفند" },
];

// Category options for extra expenses
export const expenseCategories = [
  { value: "", label: "همه" },
  { value: "office", label: "دفتری" },
  { value: "marketing", label: "بازاریابی" },
  { value: "technology", label: "تکنولوژی" },
  { value: "salary", label: "حقوق" },
  { value: "utilities", label: "آب و برق" },
  { value: "other", label: "سایر" },
];

// Category options for extra expenses dialog
export const expenseCategoriesDialog = [
  { value: "office", label: "دفتری" },
  { value: "marketing", label: "بازاریابی" },
  { value: "technology", label: "تکنولوژی" },
  { value: "salary", label: "حقوق" },
  { value: "utilities", label: "آب و برق" },
  { value: "other", label: "سایر" },
];

// Record types
export const recordTypes = [
  { value: "", label: "همه" },
  { value: "accountant", label: "حسابدار" },
  { value: "manual", label: "دستی" },
  { value: "system", label: "سیستم" },
];
