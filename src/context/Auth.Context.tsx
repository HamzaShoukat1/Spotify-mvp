import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken } from '@/storage/secureStorage';
import * as SecureStore from "expo-secure-store"
const AuthContext = createContext<{
    userToken: string | null;
    isLoading: boolean;
}>({
    userToken: null,
    isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const CheckingToken = async () => {
            let token = null;
            try {
                token = await SecureStore.getItemAsync("accessToken");


            } catch (e) {
                console.error('Failed to load token', e);
            }
            setUserToken(token);
            setIsLoading(false);
        };

        CheckingToken();
    }, []);



    return (
        
        <AuthContext.Provider value={{ userToken, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
