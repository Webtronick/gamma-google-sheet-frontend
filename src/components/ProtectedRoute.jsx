import Loader from './Loader/Loader';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isLogin, loading, setIsAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(isLogin !== null){
            if (isLogin) {
                let isAdmin = localStorage.getItem('role') === 'admin';

                if (isAdmin) {
                    setIsAdmin(true);
                    navigate('/users');
                } else {
                    setIsAdmin(false);
                    navigate('/dashboard');
                }
            } else {
                navigate('/login');
                setIsAdmin(false);
            }
        }
    }, [isLogin]);

    return (
        <>
            {children}
            {loading && <Loader/>}
        </>
    )
};

export default ProtectedRoute; 