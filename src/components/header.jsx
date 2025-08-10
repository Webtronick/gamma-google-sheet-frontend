import { Bell, Settings, Clock, LogOut, Moon, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Header = ({ toggleSidebar }) => {
    const { userProfile, setUserProfile, setUser } = useAuth();

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
            setUser(null);
            setUserProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
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
                        
                        {userProfile && (
                            <h1 className="text-2xl font-bold text-gray-900">Bienvenido(a), {userProfile.name} {userProfile.lastname}</h1>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={signOut}
                            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
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