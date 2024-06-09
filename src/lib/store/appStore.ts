import { create } from "zustand";
import { convertToShamsi } from "../utils/date/convertToShamsi";

type FormData = {
  id: string;
  first_name: string;
  last_name: string;
  school: string;
  phone_number: string;
  home_phone: string;
  parent_phone: string;
  field: string;
  grade: string;
  created?: string;
};

type FormStore = {
  formData: FormData[];
  addFormData: (data: FormData) => void;
  deleteFormData: (id: string) => void;
};

export const appStore = create<FormStore>((set) => ({
  formData: [],
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
}));
