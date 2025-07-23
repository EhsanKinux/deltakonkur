export interface IAssessments {
  id: string;
  student: string;
  advisor_name: string;
  student_name: string;
  plan_score: string;
  report_score: string;
  phone_score: string;
  advisor_behaviour_score: string;
  followup_score: string;
  motivation_score: string;
  exam_score: string;
  advisor_score: string;
  created: string;
  description: string;
}

export interface SupervisorProfile {
  id: number;
  level: number;
  bank_account: string;
  created: string;
  updated: string;
  user: number;
  last_withdraw: string;
}
