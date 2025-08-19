import Modal from './Modal/Modal';
import ToastSimple from '../utils/ToastSimple';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { Slide, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UsersTable = ({ data }) => {
    const { setLoading } = useAuth();
    const [filterText, setFilterText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
    });
    const nav = useNavigate();


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
                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-medium text-sm">
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
            name: 'Creado',
            selector: row => row.created_at,
            sortable: true,
            cell: row => (  
                <div className="text-sm text-gray-600">
                    {new Date(row.created_at).toLocaleDateString('es-ES')}
                </div>
            ),
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={()=>nav('/user/detail/' + row.id, {state: {email: row.email, name: row.name}})}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Filtrado de datos
    const filteredItems = data.filter(
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitInviteUser = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const reSimple = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!reSimple.test(formData.email)) {
            setError('Email inválido');
            return;
        }
        setLoading(true);
        let body = {
            email: formData.email
        };

        fetch(import.meta.env.VITE_BACKEND_URL + '/invite-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                setShowModal(false);
                setFormData({ email: '' });
                ToastSimple.toastSuccess('Usuario invitado correctamente');
            }else{
                ToastSimple.toastError('Error al invitar usuario');
            }
            setLoading(false);
        })
        .catch(error => {
            ToastSimple.toastError('Error al invitar usuario');
            setLoading(false);
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between w-full sm:flex-row flex-col">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-primary-900 border border-gray-200 rounded-lg text-primary-50 hover:bg-primary-900 transition-colors flex items-center gap-2 mb-4 sm:mb-0 sm:hidden block"
                    >
                        Invitar usuarios
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Lista de Usuarios</h2>
                    <div className="flex items-end gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-auto w-full"
                            />
                        </div>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-primary-900 border border-gray-200 rounded-lg text-primary-50 hover:bg-primary-900 transition-colors flex items-center gap-2 sm:block hidden"
                        >
                            Invitar usuarios
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="p-6 w-full">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationResetDefaultPage={resetPaginationToggle}
                    paginationRowsPerPageOptions={[30, 50, 100]}
                    paginationRowsPerPage={30}
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
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Invitar usuarios">
                <form onSubmit={handleSubmitInviteUser} className="flex flex-col gap-2">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email*
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-colors"
                                placeholder="Email"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>
                    <button type="submit" className="h-10 mt-4 bg-primary-900 border border-gray-200 rounded-lg text-primary-50 hover:bg-primary-800 transition-colors">Enviar</button>
                </form>
            </Modal>
        </div>
    );
};

export default UsersTable; 