export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  parent_phone: string;
  home_phone: string;
  package_price: string;
  school: string;
  field: string;
  grade: number;
  created: string;
  created_at: string;
  solar_date_day: number;
  solar_date_month: number;
  solar_date_year: number;
}

export interface AdvisorStudentData {
  student: Student;
  duration: number;
  start_date: string;
  end_date: string;
  started_date: string;
  ended_date: string;
  wage: string;
  status: string;
}

export interface AdvisorDataResponse {
  data: AdvisorStudentData[];
  total_wage: number;
}

export interface StudentWithDetails2 extends Student {
  status: string;
  started_date: string;
  ended_date: string;
  duration: number;
  start_date: string;
  end_date: string;
  wage: string;
}

export interface PaymentHistoryRecord {
  id: number;
  advisor: string;
  amount: number;
  last_pay: string; // Date as ISO string
}
