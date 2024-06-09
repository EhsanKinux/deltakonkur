import { create } from "zustand";

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
};

type FormStore = {
  formData: FormData[];
  addFormData: (data: FormData) => void;
  deleteFormData: (id: string) => void;
};

export const appStore = create<FormStore>((set) => ({
  formData: [],
  addFormData: (data: FormData) =>
    set((state) => {
      if (!state.formData.some((student) => student.id === data.id)) {
        return { formData: [...state.formData, data] };
      } else {
        return state;
      }
    }),
  deleteFormData: (id: string) =>
    set((state) => ({
      formData: state.formData.filter((student) => student.id !== id),
    })),
}));
