import { FormEntry } from "../../../student/table/interfaces";

export interface ProcessedStudentData extends FormEntry {
  status: string | null;
  id: string;
  created: string;
  started_date: string;
  ended_date: string;
}

export interface StudentInformation {
  [key: string]: ProcessedStudentData | undefined;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  parent_phone: string;
  home_phone: string;
  school: string;
  field: string;
  grade: string;
  created: string;
  created_at: string;
  solar_date_day: string | null;
  solar_date_month: string | null;
  solar_date_year: string | null;
}

export interface AdvisorDetailEntry {
  id: string;
  student: Student;
  advisor: string;
  status: string;
  started_date: string;
  ended_date: string | null;
  solar_date_day: string | null;
  solar_date_month: string | null;
  solar_date_year: string | null;
}

export interface StudentWithDetails extends Student {
  status: string;
  started_date: string;
  ended_date: string | null;
}
