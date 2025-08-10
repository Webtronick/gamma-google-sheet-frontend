import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const Init = () => {
    const { user, isLogin } = useAuth();
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

    return (
        <></>
    )
};

export default Init;
