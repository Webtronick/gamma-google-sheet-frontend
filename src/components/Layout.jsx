import { useEffect, useState } from 'react';
import Header from './header';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(()=>{
        console.log("cambio a: ", sidebarOpen);
    }, [sidebarOpen])
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className={`shadow-md transition-all duration-400 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
                <Sidebar/>
            </div>

            <div className="flex-1 flex flex-col overflow-x-auto z-100">
                {/* Header */}
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>
                {/* Contenido principal */}
                <div className="flex-1 flex overflow-y-auto">
                    {/* Contenido dinámico */}
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Layout; 