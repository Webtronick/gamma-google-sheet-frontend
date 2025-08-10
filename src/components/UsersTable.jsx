import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const UsersTable = ({ data }) => {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [userList, setUserList] = useState([]);

    const nav = useNavigate();

    useEffect(()=>{
        sendRequest();
    },[])

    const sendRequest = async () =>{
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')

                console.log("data nueva: ", data);

            if (error) {
                console.error('Error getting the users:', error);
                return null;
            } else {
                setUserList(data);
                return data;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }


    // Función para obtener el color del status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Función para obtener el color del rol
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'user':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Columnas para DataTable
    const columns = [
        {
            name: 'Usuario',
            selector: row => row.name,
            sortable: true,
            cell: row => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {((row.name).substring(0,2)).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-left text-gray-900">{row.name}</div>
                        <div className="text-sm text-gray-500">{row.email}</div>
                    </div>
                </div>
            ),
            width: '320px'
        },
        {
            name: 'Rol',
            selector: row => row.role,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(row.role)}`}>
                    {row.role}
                </span>
            ),
        },
        {
            name: 'Estado',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status ? 'Active' : 'Inactive')}`}>
                    {row.status ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            name: 'Último Acceso',
            selector: row => row.lastLogin,
            sortable: true,
            cell: row => (
                <div className="text-sm text-gray-600">
                    {new Date(row.lastLogin).toLocaleDateString('es-ES')}
                </div>
            ),
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={()=>nav('/dashboard', {state: {id: row.id}})}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            ),
            // width: '200px'
        }
    ];

    // Filtrado de datos
    const filteredItems = userList.filter(
        item => item.name.toLowerCase().includes(filterText.toLowerCase()) ||
                item.email.toLowerCase().includes(filterText.toLowerCase()) ||
                item.role.toLowerCase().includes(filterText.toLowerCase())
    );

    // Estilos personalizados para DataTable
    const customStyles = {
        table: {
            style: {
                backgroundColor: 'transparent',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151',
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                color: '#374151',
                borderBottom: '1px solid #f3f4f6',
                '&:hover': {
                    backgroundColor: '#f9fafb',
                },
            },
        },
        pagination: {
            style: {
                backgroundColor: 'transparent',
                borderTop: '1px solid #e5e7eb',
            },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h2>
                    <div className="flex items-end gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button 
                            className="px-4 py-2 bg-primary-600 border border-gray-200 rounded-lg text-primary-50 hover:bg-primary-700 transition-colors flex items-center gap-2"
                        >
                                Invitar usuarios
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationResetDefaultPage={resetPaginationToggle}
                    persistTableHead
                    customStyles={customStyles}
                    paginationComponentOptions={{
                        rowsPerPageText: 'Filas por página:',
                        rangeSeparatorText: 'de',
                        selectAllRowsItem: true,
                        selectAllRowsItemText: 'Todos',
                    }}
                />
            </div>
        </div>
    );
};

export default UsersTable; 