import { useEffect, useState } from 'react';
import UsersContent from '../../components/UsersContent';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const UsersList = () => {
    const { isAdmin, setLoading } = useAuth();
    // Datos de ejemplo para usuarios
    const [data, setData] = useState([]);

    const sendRequest = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').order('role', { ascending: true }).order('created_at', { ascending: true });
        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setData(data);
        };
        setLoading(false);
    };

    useEffect(() => {
        sendRequest();
    }, []);

    return (
        isAdmin && <UsersContent data={data} />
    );
};

export default UsersList; 