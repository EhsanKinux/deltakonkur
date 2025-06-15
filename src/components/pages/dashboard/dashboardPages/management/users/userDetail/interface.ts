export interface IUserDetail {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
  roles?: number[];
}

export interface IUserDetail2 {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
  roles?: string;
}
