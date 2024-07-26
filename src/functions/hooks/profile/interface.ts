// Define the interface for the student data
export interface IStudent {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    parent_phone: string;
    home_phone: string;
    school: string;
    field: string;
    grade: number;
    created: string;
    created_at: string;
    solar_date_day: number;
    solar_date_month: number;
    solar_date_year: number;
  }
  
  export interface ICountingStudents {
    id: number;
    student: IStudent;
    advisor: number;
    status: string;
    started_date: string;
    ended_date: string;
    solar_date_day: number;
    solar_date_month: number;
    solar_date_year: number;
    expire_date: string;
    left_days_to_expire: string;
    stop_date: string;
  }