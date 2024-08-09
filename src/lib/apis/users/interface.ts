export interface ISubmitUserRegisteration {
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
}

export interface RoleChangeParams {
  userId: number;
  body: {
    role: number;
  };
}