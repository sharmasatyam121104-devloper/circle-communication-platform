import { create } from "zustand";

import api from "../lib/api";

interface UserInterface {
    _id: string;
    fullname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    last_login: Date;
    profile_picture_url: string;
}

interface AuthStore {
    user: UserInterface | null;
    loading: boolean;
    getMe: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: false,
    getMe: async () => {
        set({ loading: true,});
        try {
            const { data } = await api.get<UserInterface>("/user/get-me");
            set({user: data,});
        } 
        catch{
            set({user: null,});
        } 
        finally {
            set({loading: false,});
        }
    },
}));

export default useAuthStore;