import { CancelStudentBody } from "@/functions/hooks/canceling/interface";

export interface CancelStudentParams {
  studentId: string;
  body: CancelStudentBody;
}
