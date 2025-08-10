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

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session?.user) {
              setUser(session.user);
              setIsLogin(true);
            } else {
              setUser(null);
              setIsLogin(false);
            }
            setLoading(false);
          }
        );
    
        return () => {
          authListener.subscription.unsubscribe();
        };
    }, []);

    // useEffect(() => {
    //     // Obtener sesión inicial
    //     const getSession = async () => {
    //         const { data: { session } } = await supabase.auth.getSession();
    //         if (session?.user) {
    //             setUser(session.user);
    //             await fetchUserProfile(session.user.id);
    //         }
    //         console.log("la data: ", session)
    //         setLoading(false);
    //     };

    //     getSession();

    //     // Escuchar cambios en la autenticación
    //     const { data: { subscription } } = supabase.auth.onAuthStateChange(
    //         async (event, session) => {
    //             if (session?.user) {
    //                 setUser(session.user);
    //                 await fetchUserProfile(session.user.id);
    //             } else {
    //                 setUser(null);
    //                 setUserProfile(null);
    //             }
    //             setLoading(false);
    //         }
    //     );
    //     return () => subscription.unsubscribe();
    // }, []);
    
    const value = {
        user,
        setUser,
        // userProfile,
        // setUserProfile,
        loading,
        setLoading,
        isLogin
        // isAdmin: userProfile?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 