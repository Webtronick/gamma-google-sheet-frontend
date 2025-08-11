import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser]               = useState(false);
    const [loading, setLoading]         = useState(false);
    const [isLogin, setIsLogin]         = useState(null);
    const [isAdmin, setIsAdmin]         = useState(false);
    const [infoUser, setInfoUser]       = useState(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session?.user) {
                localStorage.setItem('token', session.access_token);           
                setUser(session.user);
                setIsLogin(true);
            } else {
                setUser(null);
                localStorage.removeItem('token');
                setIsLogin(false);
                setInfoUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
          }
        );
    
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    
    const value = {
        user,
        setUser,
        loading,
        setLoading,
        isLogin,
        setIsLogin,
        isAdmin,
        setIsAdmin,
        infoUser,
        setInfoUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 