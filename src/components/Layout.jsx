import { useEffect, useState } from 'react';
import Header from './header';
import Sidebar from './Sidebar';
import Loader from './Loader/Loader';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { Outlet, useNavigate } from 'react-router';

const Layout = () => {
    const { isLogin, user, setIsAdmin, isAdmin, setInfoUser, loading, setUser, setIsLogin } = useAuth();
    const navigate = useNavigate();
    
    const [ready, setReady]             = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024); // Default to true on desktop
    const [isMobile, setIsMobile]       = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // On mobile, we want to close the sidebar by default
            if (mobile) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(()=>{
        // completamos ctx
        const profileData = JSON.parse(localStorage.getItem('profile'));
        const userData = JSON.parse(localStorage.getItem('user'));
        if(profileData){
            userData && setUser(userData);
            profileData && setInfoUser(profileData);
            const role = profileData.role;
            setIsAdmin(role === 'admin');
            setIsLogin(true);

            let route = window.location.pathname;
            if(route === '/'){
                if(role !== 'admin'){
                    navigate('/dashboard');
                }else{
                    navigate('/users');
                }
            }
        }else{
            setIsAdmin(false);
            setUser(null);
            setIsLogin(false);
            setInfoUser(null);
            localStorage.removeItem('profile');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [])

    useEffect(() => {
        if(user !== false && user !== null){
            setReady(true);
        }
    }, [user]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className={`shadow-md transition-all duration-400 ${sidebarOpen ? "w-60" : "w-0 overflow-hidden"}`}>
                <Sidebar/>
            </div>

            <div className="flex flex-col w-full overflow-x-auto z-100">
                {/* Header */}
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>
                {/* Contenido principal */}
                <main className="w-full p-6">
                    {ready && <Outlet />}
                </main>
                <ToastContainer />
                <a href="https://webtronick.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 mt-2 pr-12 pb-1 text-right block">
                    Powered by <span className="font-bold text-blue-600">Webtronick</span>
                </a>
            </div>
            {loading && <Loader />}
        </div>
    );
};

export default Layout; 