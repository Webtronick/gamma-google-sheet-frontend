import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabase';
import { DollarSign, TrendingUp, TrendingDown, Activity, Search } from 'lucide-react';
import CardWidget from '../../components/cardWidget';
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const location  = useLocation();
    const { id }    = location.state || {};

    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState({
        totalAmount: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalTransactions: 0
    });

    const fetchData = async () => {
        // setLoading(true);
        try {
            // Aquí deberías ajustar según tu estructura de datos
            // Por ahora usamos datos de ejemplo
            const mockData = [
                { id: 1, start_date: '12/08/2025', init_capital: 300, current_capital: 400, withdraw: 100, current_profitability: '10%', retained_earning: 60,  retained_profitability: '5%' },
                { id: 2, start_date: '14/08/2024', init_capital: 300, current_capital: 900, withdraw: 100, current_profitability: '1%', retained_earning: 58,  retained_profitability: '9%' },
                { id: 3, start_date: '14/06/2024', init_capital: 300, current_capital: 1000, withdraw: 600, current_profitability: '12%', retained_earning: 30,  retained_profitability: '3%' },

            ];

            setData(mockData);

            // Calcular totales
            const totalAmount = mockData.reduce((sum, item) => sum + item.retained_earning, 0);
            const totalIncome = mockData.filter(item => item.type === 'income').reduce((sum, item) => sum + item.retained_earning, 0);
            const totalExpenses = mockData.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.retained_earning, 0);

            setTotals({
                totalAmount,
                totalIncome,
                totalExpenses,
                totalTransactions: mockData.length
            });

            // setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Configuración de widgets
    const widgets = [
        {
            title: 'Total General',
            value: `$${totals.totalAmount.toLocaleString()}`,
            icon: DollarSign,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Ingresos',
            value: `$${totals.totalIncome.toLocaleString()}`,
            icon: TrendingUp,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Gastos',
            value: `$${totals.totalExpenses.toLocaleString()}`,
            icon: TrendingDown,
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600'
        },
        {
            title: 'Transacciones',
            value: totals.totalTransactions,
            icon: Activity,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        }
    ];

    const columns = [
        {
            name: 'Fecha de inicio',
            selector: row => row.start_date,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    {row.start_date}
                </span>
            ),
        },
        {
            name: 'Capital inicial',
            selector: row => row.init_capital,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    ${row.init_capital}
                </span>
            ),
        },
        {
            name: 'Capital actual',
            wrap: true,
            selector: row => row.current_capital,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    ${row.current_capital}
                </span>
            ),
        },
        {
            name: 'Retiros o liquidación',
            selector: row => row.withdraw,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    ${row.withdraw}
                </span>
            ),
        },
        {
            name: 'Rentabilidad actual',
            selector: row => row.current_profitability,
            wrap: true,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    {row.current_profitability}
                </span>
            ),
        },
        {
            name: 'Ganancia acumulada',
            wrap: true,
            selector: row => row.retained_earning,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    ${row.retained_earning}
                </span>
            ),
        },
        {
            name: 'Rentabilidad acumulada',
            wrap: true,
            selector: row => row.retained_profitability,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    {row.retained_profitability}
                </span>
            ),
        }
    ];

    // Filtrado de datos
    const filteredItems = data.filter(
        item => item.start_date?.toLowerCase().includes(filterText.toLowerCase())
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
                whiteSpace: "normal", // Permite saltos
                wordBreak: "break-word" // Rompe palabras largas
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
        headCells: {
            style: {
                whiteSpace: "normal",  // Permite saltos en los títulos
                wordBreak: "break-word",
                fontWeight: "600",
                fontSize: "14px",
                color: "#374151"
            }
        },
        cells: {
            style: {
                whiteSpace: "normal",  // Permite saltos en el contenido
                wordBreak: "break-word",
            }
        },
        pagination: {
            style: {
                backgroundColor: 'transparent',
                borderTop: '1px solid #e5e7eb',
            },
        },
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando datos...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <p>Informacion del usuario con id: {id}</p>
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {widgets.map((widget, index) => (
                    <CardWidget
                        key={index}
                        title={widget.title}
                        value={widget.value}
                        icon={widget.icon}
                        bgColor={widget.bgColor}
                        iconColor={widget.iconColor}
                    />
                ))}
            </div>

            {/* Lista de transacciones */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Transacciones</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar por fecha..."
                                    value={filterText}
                                    onChange={e => setFilterText(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        responsive={true}
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
        </Layout>
    );
};

export default Dashboard; 