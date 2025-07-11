// src/types/index.ts
export type Advisor = {
  id: string;
  first_name: string;
  last_name: string;
  field: string;
  phone_number: string;
  national_id: string;
  bank_account: string;
  active_students?: string;
  stopped_students?: string;
  cancelled_students?: string;
  // activePercentage?: number;
  level: string;
  subject?: string;
  overall_satisfaction?: number;
  current_month_satisfaction?: number;
};

export type FormData = {
  id: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  school: string;
  phone_number: string;
  home_phone: string;
  parent_phone: string;
  field: string;
  grade: string;
  created?: string;
  package_price?: string;
  advisor: string | null;
  advisor_id: string | null;
  advisor_name: string | null;
  supervisor: string | null;
  supervisor_id: string | null;
  supervisor_name: string | null;
  solar_date_day?: string;
  solar_date_month?: string;
  solar_date_year?: string;
};

export type IadvisorStudent = {
  id: string;
  student: string;
  advisor: string;
  status: string;
  started_date: string;
  ended_date: string;
  active_students: string;
  stopped_students: string;
  cancelled_students: string;
}[];

export type FormStore = {
  formData: FormData[];
  advisors: Advisor[];
  advisorInfo: Advisor | null;
  studentInfo: FormData | null;
  advisorStudent: IadvisorStudent | null;
  loading: boolean;
  error: string | null;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
  addFormData: (data: FormData) => void;
  deleteFormData: (id: string) => void;
  setAdvisors: (advisors: Advisor[]) => void;
  addAdvisor: (advisor: Advisor) => void;
  deleteAdvisor: (id: string) => void;
  setAdvisorInfo: (advisor: Advisor | null) => void;
  setStudentInfo: (data: FormData | null) => void;
  setAdvisorStudent: (advisorSt: IadvisorStudent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export type IallStudents = {
  id: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  school: string;
  phone_number: string;
  home_phone: string;
  parent_phone: string;
  field: string;
  grade: string;
  created: string;
  advisor_name: string;
};

export type IallAdvisors = {
  id: string;
  first_name: string;
  last_name: string;
  field: string;
  phone_number: string;
  national_id: string;
  bank_account: string;
  active_students: string;
  stopped_students: string;
  cancelled_students: string;
};

export type IAccountStore = {
  allstudents: IallStudents[];
  alladvisors: IallAdvisors[];

  setAllstudents: (students: IallStudents[]) => void;
  addAllstudents: (student: IallStudents) => void;
  deleteStudent: (id: string) => void;

  setAlladvisors: (advisor: IallAdvisors[]) => void;
  addAlladvisors: (advisor: IallAdvisors) => void;
};
