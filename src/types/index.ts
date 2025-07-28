// =============================================================================
// BASE TYPES
// =============================================================================

export interface BaseEntity {
  id: string | number;
  created?: string;
  updated?: string;
}

export interface BasePerson extends BaseEntity {
  first_name: string;
  last_name: string;
  phone_number: string;
}

// =============================================================================
// USER RELATED TYPES
// =============================================================================

export interface User extends BasePerson {
  national_id: string;
  roles: number[];
  role?: string; // For backward compatibility
}

export interface UserDetail extends User {
  // Additional user detail fields if needed
}

// =============================================================================
// STUDENT RELATED TYPES
// =============================================================================

export interface Student extends BasePerson {
  date_of_birth: string;
  parent_phone: string;
  home_phone: string;
  school: string;
  field: string;
  grade: number | string;
  national_id?: string;
  bank_account?: string;
  level?: string;
  status?: "active" | "inactive" | "stopped";
  package_price?: number;
  solar_date_day: number | string;
  solar_date_month: number | string;
  solar_date_year: number | string;
  created_at?: string;
}

export interface StudentWithAdvisor extends Student {
  advisor: string | number;
  advisor_name?: string;
  expire_date?: string;
  stop_date?: string;
}

// =============================================================================
// ADVISOR RELATED TYPES
// =============================================================================

export interface Advisor extends BasePerson {
  field: string;
  level: string;
  national_id?: string;
  bank_account?: string;
  student_count?: number;
}

export interface AdvisorDetail extends Advisor {
  students?: Student[];
  performance_data?: PerformanceData[];
}

export interface PerformanceData {
  month: string;
  score: number;
  student_count: number;
}

// =============================================================================
// CONTENT RELATED TYPES
// =============================================================================

export interface Content extends BaseEntity {
  advisor: string | number;
  subject: string;
  is_delivered: boolean;
  delivered_at?: string;
  notes?: string;
  solar_year?: number;
  solar_month?: number;
  persian_month_name?: string;
}

export interface ContentAdvisor extends BaseEntity {
  advisor: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  solar_year: number;
  solar_month: number;
  is_delivered: boolean;
  delivered_at: string | null;
  notes: string | null;
  persian_month_name: string;
}

// =============================================================================
// ASSESSMENT RELATED TYPES
// =============================================================================

export interface Assessment extends BaseEntity {
  student: string;
  advisor_name: string;
  student_name: string;
  plan_score: string;
  report_score: string;
  phone_score: string;
  advisor_behaviour_score: string;
  followup_score: string;
  motivation_score: string;
  exam_score: string;
  advisor_score: string;
  description: string;
}

// =============================================================================
// SALES MANAGER TYPES
// =============================================================================

export interface SalesManager extends BaseEntity {
  national_number: string;
  student_id: number;
  student_count: string;
  student_name?: string;
  student_last_name?: string;
  first_name?: string;
  last_name?: string;
}

// =============================================================================
// FORM RELATED TYPES
// =============================================================================

export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface FormData {
  [key: string]: unknown;
}

// =============================================================================
// TABLE RELATED TYPES
// =============================================================================

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  actions?: {
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
  };
}

// =============================================================================
// API RELATED TYPES
// =============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface LoadingProps {
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Role = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Status = "active" | "inactive" | "stopped" | "cancelled";

export type Grade = 9 | 10 | 11 | 12;

export type Field = "ریاضی" | "تجربی" | "انسانی";

export type Level = "مبتدی" | "متوسط" | "پیشرفته";

// =============================================================================
// LEGACY TYPE ALIASES (for backward compatibility)
// =============================================================================

// These aliases help maintain backward compatibility during refactoring
export type FormEntry = Student;
export type IUsers = User;
export type IUserDetail = UserDetail;
export type IStudent = Student;
export type IAdvisor = Advisor;
export type IContent = Content;
export type IAssessment = Assessment;
export type ISalesManager = SalesManager;
