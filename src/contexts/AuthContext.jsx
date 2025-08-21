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
    const [is2FAAvailable, setIs2FAAvailable] = useState(false);
    const [enabledLogin, setEnabledLogin] = useState(false);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session?.user) {
                localStorage.setItem('token', session.access_token);           
                setUser(session.user);
                const available = verifyAvailabilityLogin();
                
                /* if(user && available){
                    setIsLogin(true);
                } */
            } else {
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                localStorage.removeItem('profile');
                localStorage.removeItem('freq');
                // setIsLogin(false);
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

    useEffect(() => {
        const available = verifyAvailabilityLogin();

        if(user && is2FAAvailable && enabledLogin && available){
            setIsLogin(true);
        }else{
            if(user && available){
                setIsLogin(true);
            }else{
                setIsLogin(false);
            }
        }
    }, [user, is2FAAvailable, enabledLogin]);

    const verifyAvailabilityLogin = ()=>{
        const login = localStorage.getItem('freq');
        if(login){
            const availableLogin = atob(atob(atob(atob(login))));
            const available = availableLogin.split("-")[1];
            return available === "1";
        }
        return false;
    }
    
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
        setInfoUser,
        is2FAAvailable,
        setIs2FAAvailable,
        enabledLogin,
        setEnabledLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 