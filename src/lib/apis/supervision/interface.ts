export interface IPostStudentAssessment {
  student: string;
  plan_score: string;
  report_score: string;
  phone_score: string;
  advisor_behaviour_score: string;
  followup_score: string;
  motivation_score: string;
  exam_score: string;
  advisor_score: string;
}

export type StudentCallAnsweringBody = {
  id: number;
  student: number;
  first_call: boolean;
  first_call_time: string;
  second_call: boolean;
  second_call_time: string | null;
  completed_time: string | null;
};

export type StudentCallAnsweringBody2 = {
  student: number;
  first_call: boolean;
  first_call_time: string;
  second_call: boolean;
  second_call_time: string | null;
  completed_time: string | null;
};

