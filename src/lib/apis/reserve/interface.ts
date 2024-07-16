export interface ISubmitStudentRegisterService {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  parent_phone: string;
  home_phone: string;
  school: string;
  field: string;
  grade: string;
  created: string;
}

export interface IRegisterStudentService {
  date_of_birth: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  parent_phone: string;
  home_phone: string;
  school: string;
  field: string;
  grade: string;
  created: string;
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
}
