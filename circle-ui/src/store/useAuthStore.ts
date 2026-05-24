import { create } from "zustand";
import axios from "axios";

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
        catch (error: unknown) {

            if ( axios.isAxiosError(error) && error.response?.status === 401) {
                try {
                    await api.get("/user/refresh-token");
                    const { data } = await api.get<UserInterface>("/user/get-me");
                    set({user: data,});
                } 
                catch (refreshError: unknown) {

                    if (axios.isAxiosError(refreshError) && (refreshError.response?.status === 401 || refreshError.response?.status === 404)) {
                    set({user: null,});
                    }
                }
            } 
            else {
                set({user: null,});
            }
        } 
        finally {
            set({loading: false,});
        }
    },
}));

export default useAuthStore;