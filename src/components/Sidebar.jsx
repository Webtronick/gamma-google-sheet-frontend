import { ChevronRight, Users } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="bg-gray-900 h-full text-white">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">G</span>
                        </div>
                        <span className="font-bold text-lg">Gamma clientes</span>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Navegación simplificada */}
                <nav className="space-y-2">
                    <div className="space-y-1">
                        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-blue-600 text-white rounded-lg">
                            <Users className="w-5 h-5" />
                            <span>Users</span>
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar; 