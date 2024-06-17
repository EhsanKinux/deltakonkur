// src/types/index.ts
export type Advisor = {
  id: string;
  first_name: string;
  last_name: string;
  field: string;
  phone_number: string;
  national_id: string;
  bank_account: string;
};

export type FormData = {
  id: string;
  first_name: string;
  last_name: string;
  school: string;
  phone_number: string;
  home_phone: string;
  parent_phone: string;
  field: string;
  grade: string;
  created?: string;
};

export type FormStore = {
  formData: FormData[];
  advisors: Advisor[];
  advisorInfo: Advisor | null;
  studentInfo: FormData | null;
  loading: boolean;
  error: string | null;
  addFormData: (data: FormData) => void;
  deleteFormData: (id: string) => void;
  setAdvisors: (advisors: Advisor[]) => void;
  addAdvisor: (advisor: Advisor) => void;
  deleteAdvisor: (id: string) => void;
  setAdvisorInfo: (advisor: Advisor | null) => void;
  setStudentInfo: (data: FormData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};
