export interface IAdvisorContent {
  id: number;
  advisor: number;
  subject: string;
  created: string;
  is_delivered: boolean | string;
  delivered_at: string;
}[]
