import { ChevronRight, House, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';

const Sidebar = () => {

    const {isAdmin} = useAuth();

    return (
        <div className="bg-gray-900 h-full text-white">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">Gamma clientes</span>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Navegación simplificada */}
                <nav className="space-y-2">
                    <div className="space-y-1">
                        {isAdmin && (
                            <Link to="/users" className="flex items-center gap-3 px-3 py-2 bg-blue-900 text-white rounded-lg">
                                <Users className="w-5 h-5" />
                                <span>Users</span>
                            </Link>
                        )}
                        {
                            !isAdmin && (
                                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-900 text-white rounded-lg">
                                    <House className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                            )
                        }
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar; 