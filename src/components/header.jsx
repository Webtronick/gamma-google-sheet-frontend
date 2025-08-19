import ToastSimple from '../utils/ToastSimple';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, RefreshCcw } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const { setUser, user, isAdmin, setIsLogin, infoUser, setLoading } = useAuth();
    const [loadingSync, setLoadingSync] = useState(false);

    const signOut = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                setLoading(false);
                throw error;
            }
            setUser(null);
            setIsLogin(false);
            localStorage.removeItem("role");
            localStorage.removeItem("profile");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate('/login');
        } catch (error) {
            setLoading(false);
            console.error('Error signing out:', error);
        }
    };

    const syncData = async () => {
        setLoadingSync(true);
        fetch(import.meta.env.VITE_BACKEND_URL+"/webhook-make", {
            method: 'POST'
        })
        .then(response => {
            if(response.status === 200){
                ToastSimple.toastSuccess('Proceso iniciado, esto puede tomar unos minutos');
            }else{
                ToastSimple.toastError('Error. Webhook no esta funcionando');
            }
            setLoadingSync(false);
        })
        .catch(error => {
            ToastSimple.toastError('Error. Webhook no esta funcionando');
            setLoadingSync(false);
        });
    };

    return (
        <header className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="flex items-center gap-2">
                <button
                    className="p-2 rounded hover:bg-gray-100"
                    onClick={toggleSidebar}
                >
                    <Menu size={24} />
                </button>
                <div className='flex items-center justify-between w-full'>
                    <div>
                        {user && (
                            <h1 className="md:text-xl font-bold text-gray-900">Bienvenido(a), {infoUser?.name}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {
                            isAdmin && (
                                <button 
                                    onClick={syncData}
                                    disabled={loadingSync}
                                    className="h-10 gap-2 rounded-full px-4 bg-blue-900 flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                                >
                                    {
                                        loadingSync ? 
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        :
                                        <RefreshCcw className="w-5 h-5" />
                                    }
                                    <p className="hidden md:block">Sincronizar Datos Usuarios</p>
                                </button>
                            )
                        }
                        <button 
                            onClick={signOut}
                            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 