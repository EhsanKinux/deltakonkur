import { api } from "@/lib/services/api";
import { Student } from "@/types";
import { ISubmitStudentRegisterService } from "@/lib/apis/reserve/interface";
import { convertToShamsi2 } from "@/lib/utils/date/convertDate";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

// =============================================================================
// STUDENT SERVICE INTERFACE
// =============================================================================

export interface IStudentService {
  getStudents(params: GetStudentsParams): Promise<PaginatedResponse<Student>>;
  getStudentById(id: string): Promise<Student>;
  updateStudent(data: ISubmitStudentRegisterService): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  updateStudentAdvisor(params: UpdateAdvisorParams): Promise<void>;
  updateStudentSupervisor(params: UpdateSupervisorParams): Promise<void>;
}

// =============================================================================
// TYPES
// =============================================================================

export interface GetStudentsParams {
  page: number;
  first_name?: string;
  last_name?: string;
  grade?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface UpdateAdvisorParams {
  studentId: string;
  advisorId: string;
  solarDate?: {
    day: string;
    month: string;
    year: string;
  };
}

export interface UpdateSupervisorParams {
  studentId: string;
  supervisorId: string;
  solarDate?: {
    day: string;
    month: string;
    year: string;
  };
}

// =============================================================================
// STUDENT SERVICE IMPLEMENTATION
// =============================================================================

export class StudentService implements IStudentService {
  private readonly baseUrl = "api/register";

  async getStudents(
    params: GetStudentsParams
  ): Promise<PaginatedResponse<Student>> {
    const response = await api.getPaginated<Student>(
      `${this.baseUrl}/students-no-advisor/`,
      {
        page: params.page,
        first_name: params.first_name || "",
        last_name: params.last_name || "",
        grade: params.grade === "all" ? "" : params.grade || "",
      }
    );

    return {
      ...response,
      results: response.results.map(this.formatStudentData),
    };
  }

  async getAllStudents(
    params: GetStudentsParams
  ): Promise<PaginatedResponse<Student>> {
    const response = await api.getPaginated<Student>(
      `${this.baseUrl}/students/`,
      {
        page: params.page,
        first_name: params.first_name || "",
        last_name: params.last_name || "",
        grade: params.grade === "all" ? "" : params.grade || "",
      }
    );

    return {
      ...response,
      results: response.results.map(this.formatStudentData),
    };
  }

  async getStudentById(id: string): Promise<Student> {
    const response = await api.get<Student>(`${this.baseUrl}/students/${id}/`);
    return this.formatStudentData(response.data);
  }

  async updateStudent(data: ISubmitStudentRegisterService): Promise<Student> {
    const response = await api.put<Student>(
      `${this.baseUrl}/students/${data.id}/`,
      data
    );
    return this.formatStudentData(response.data);
  }

  async deleteStudent(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/students/${id}/`);
  }

  async updateStudentAdvisor(params: UpdateAdvisorParams): Promise<void> {
    const startedDate = this.convertSolarToISO(params.solarDate);

    await api.post("api/register/student-advisors/manage/", {
      advisor_id: params.advisorId,
      student_id: params.studentId,
      solar_date_day: params.solarDate?.day || "",
      solar_date_month: params.solarDate?.month || "",
      solar_date_year: params.solarDate?.year || "",
      started_date: startedDate,
    });
  }

  async updateStudentSupervisor(params: UpdateSupervisorParams): Promise<void> {
    const startedDate = this.convertSolarToISO(params.solarDate);

    await api.post("api/supervisor/student/", {
      ended_at: startedDate,
      id: 0,
      student_id: params.studentId,
      current_supervisor: 0,
      new_supervisor: params.supervisorId,
      supervisor_solar_date_day: params.solarDate?.day || "",
      supervisor_solar_date_month: params.solarDate?.month || "",
      supervisor_solar_date_year: params.solarDate?.year || "",
      supervisor_started_date: startedDate,
    });
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  private formatStudentData(student: Student): Student {
    const gradeMapping = {
      "10": "پایه دهم",
      "11": "پایه یازدهم",
      "12": "پایه دوازدهم",
      "13": "فارغ‌التحصیل",
      graduate: "فارغ‌التحصیل",
    };

    return {
      ...student,
      created: convertToShamsi(student.created || ""),
      date_of_birth: student.date_of_birth
        ? convertToShamsi(student.date_of_birth)
        : student.date_of_birth,
      grade:
        gradeMapping[student.grade as keyof typeof gradeMapping] ||
        "فارغ‌التحصیل",
    };
  }

  private convertSolarToISO(solarDate?: {
    day: string;
    month: string;
    year: string;
  }): string {
    if (!solarDate?.day || !solarDate?.month || !solarDate?.year) {
      return new Date().toISOString();
    }

    try {
      const now = new Date();
      const jDateString = `${solarDate.year}/${solarDate.month}/${
        solarDate.day
      } ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const m = moment(jDateString, "jYYYY/jM/jD H:m:s");
      return m.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    } catch (err) {
      console.warn("Invalid Solar date. Using current date instead.");
      return new Date().toISOString();
    }
  }
}

// =============================================================================
// HELPER FUNCTION
// =============================================================================

function convertToShamsi(date: string): string {
  return convertToShamsi2(date);
}

// =============================================================================
// SERVICE INSTANCE
// =============================================================================

export const studentService = new StudentService();
