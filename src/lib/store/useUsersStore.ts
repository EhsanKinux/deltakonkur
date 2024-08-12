import { create } from "zustand";

export interface IUsers2 {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
  role: string;
  roles: string;
}

interface UserState {
  users: IUsers2[];
  setUsers: (users: IUsers2[]) => void;
  deleteUser: (id: string) => void;
}

export const useUsersStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
