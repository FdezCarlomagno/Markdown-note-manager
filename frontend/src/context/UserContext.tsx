import { createContext, SetStateAction, useEffect, useState } from 'react';
import type { User, LoginResponse } from '../interfaces/models';
import useUser from '../hooks/useUser';

interface UserContextType {
    isLoggedIn: boolean;
    user: User | null;
    setUser: React.Dispatch<SetStateAction<User | null>>;
    error: string;
    setError: React.Dispatch<SetStateAction<string>>;
    login: (email: User['email'], password: string) => Promise<LoginResponse>;
    logout: () => void;
    createAccount: (form: Record<string, string>) => Promise<LoginResponse>;
    getProfile: () => Promise<void>;
    saveUsername: (username: string) => Promise<LoginResponse | undefined>;
    isEdited: boolean;
    setIsEdited: React.Dispatch<SetStateAction<boolean>>;
    handleChangePassword: (originalPassword: string, newPassword: string) => Promise<LoginResponse | undefined>;
    handleDeleteAccount: (passwordAccount: string) => void
    registeredEmail: string | null
    setRegisteredEmail: React.Dispatch<SetStateAction<string | null>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>('');
    const [isEdited, setIsEdited] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(user?.email as string);
    const { logout, login, createAccount, getProfile, saveUsername, isAuthenticated, handleChangePassword, handleDeleteAccount } = useUser({ setError, setUser, isEdited, setIsEdited, setIsLoggedIn });


    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            const logged = await isAuthenticated();
            setIsLoggedIn(logged);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if(isLoggedIn) getProfile();
    }, [isLoggedIn])


    // Memoize context values to avoid unnecessary re-renders
    const providerValues = {
        user,
        setUser,
        isLoggedIn: isLoggedIn,
        error,
        setError,
        login,
        logout,
        createAccount,
        getProfile,
        saveUsername,
        isEdited,
        setIsEdited,
        handleChangePassword,
        handleDeleteAccount,
        registeredEmail,
        setRegisteredEmail
    };

    return (
        <UserContext.Provider value={providerValues}>
            {children}
        </UserContext.Provider>
    );
};