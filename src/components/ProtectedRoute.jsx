import Loader from './Loader/Loader';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isLogin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(isLogin !== null){
            if (isLogin) {
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        }
    }, [isLogin]);

    if (loading) {
        return (
            <Loader/>
        );
    }
    return children;
};

export default ProtectedRoute; 