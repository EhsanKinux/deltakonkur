// src/store/appStore.ts
import { create } from "zustand";
import { convertToShamsi } from "../utils/date/convertDate";
import { Advisor, FormData, FormStore } from "./types";

export const appStore = create<FormStore>((set) => ({
  formData: [],
  advisors: [],
  advisorInfo: null,
  studentInfo: null,
  loading: false,
  error: null,
  refresh: false,
  setRefresh: (refresh) => set({ refresh }),
  setAdvisors: (advisors: Advisor[]) => set({ advisors }),
  addAdvisor: (advisor: Advisor) =>
    set((state) => {
      const advisorExists = state.advisors.some((existingAdvisor) => existingAdvisor.id === advisor.id);
      if (!advisorExists) {
        const updatedAdvisors = [...state.advisors, advisor];
        return { advisors: updatedAdvisors };
      }
      return state;
    }),
  deleteAdvisor: (advisorId) =>
    set((state) => ({
      advisors: state.advisors.filter((advisor) => advisor.id !== advisorId),
    })),
  setAdvisorInfo: (advisorInfo) => set({ advisorInfo }),
  addFormData: (data: FormData) => {
    const convertedData = {
      ...data,
      created: data.created ? convertToShamsi(data.created) : undefined,
    };

    set((state) => {
      if (!state.formData.some((student) => student.id === convertedData.id)) {
        return { formData: [...state.formData, convertedData] };
      } else {
        return state;
      }
    });
  },
  deleteFormData: (id: string) =>
    set((state) => ({
      formData: state.formData.filter((student) => student.id !== id),
    })),
  setStudentInfo: (data) => set({ studentInfo: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
