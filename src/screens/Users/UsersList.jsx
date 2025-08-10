import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import UsersContent from '../../components/UsersContent';

const UsersList = () => {
    // Datos de ejemplo para usuarios
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendRequest = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('id, name, lastname, email, role');
        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data);
            setLoading(false);
        };
        setLoading(false);
    };

    useEffect(() => {
        sendRequest();
    }, []);

    // const data = [
    //     {
    //         id: 1,
    //         name: 'Michael A. Miner',
    //         email: 'michael.miner@example.com',
    //         role: 'Admin',
    //         status: 'Active',
    //         lastLogin: '2024-01-15',
    //         avatar: 'MA'
    //     },
    //     {
    //         id: 2,
    //         name: 'Theresa T. Brose',
    //         email: 'theresa.brose@example.com',
    //         role: 'User',
    //         status: 'Active',
    //         lastLogin: '2024-01-14',
    //         avatar: 'TB'
    //     },
    //     {
    //         id: 3,
    //         name: 'John D. Smith',
    //         email: 'john.smith@example.com',
    //         role: 'Manager',
    //         status: 'Inactive',
    //         lastLogin: '2024-01-10',
    //         avatar: 'JS'
    //     },
    //     {
    //         id: 4,
    //         name: 'Sarah M. Johnson',
    //         email: 'sarah.johnson@example.com',
    //         role: 'User',
    //         status: 'Active',
    //         lastLogin: '2024-01-13',
    //         avatar: 'SJ'
    //     },
    //     {
    //         id: 5,
    //         name: 'Robert K. Wilson',
    //         email: 'robert.wilson@example.com',
    //         role: 'Admin',
    //         status: 'Active',
    //         lastLogin: '2024-01-12',
    //         avatar: 'RW'
    //     }
    // ];

    return (
        <Layout>
            <UsersContent data={users} />
        </Layout>
    );
};

export default UsersList; 