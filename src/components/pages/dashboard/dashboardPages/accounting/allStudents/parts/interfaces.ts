export type IAccountingStudents = {
  id: string;
  first_name: string;
  last_name: string;
  school: string;
  phone_number: string;
  home_phone: string;
  parent_phone: string;
  field: string;
  grade: string;
  created: string;
};

// Interface for the student object
export interface IStudent {
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
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
}

// Interface for the main student-advisor object
export interface IStudentAdvisor {
  id: string;
  student: IStudent;
  advisor: string;
  status: string;
  started_date: string;
  ended_date: string;
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
  expire_date: string;
  left_days_to_expire: string;
  stop_date: string;
  advisor_name: string;
}

export interface IFormattedStudentAdvisor {
  id: string; // ID for the whole data
  studentId: string; // ID from the student object
  grade: string;
  advisor: string;
  created: string;
  expire_date: string;
  left_days_to_expire: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  parent_phone: string;
  home_phone: string;
  school: string;
  field: string;
  created_at: string;
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
  stop_date: string;
  ended_date: string;
  status: string;
}
