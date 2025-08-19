import HandlerApp from "../../lib/HandlerApp";
import ToastSimple from "../../utils/ToastSimple";
import DataTable from "react-data-table-component";
import CardWidget from "../../components/cardWidget";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, TrendingUp, ArrowLeftRight, Search, ArrowLeft } from 'lucide-react';

const UserDetail = () => {
    const navigate = useNavigate();
    const location  = useLocation();
    const { email, name } = location.state || {};
    const { id } = useParams();       

    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const { setLoading, isAdmin } = useAuth();

    const [totals, setTotals] = useState({
        current_capital: 0,
        retained_earnings: 0,
        retained_profitability: 0,
        movements: 0
    });

    useEffect(() => {
        isAdmin && sendRequest();
    }, []);

    const sendRequest = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('carteras').select('*').eq('email', email);
        if (error) {
            ToastSimple.toastError("Se produjo un error al obtener los datos");
        } else {
            if(data.length > 0){
                let infoWidgets = data[data.length - 1];
                let datos = data;
                datos[data.length - 1].start_date = 'TOTAL';
                setTotals({
                    current_capital: infoWidgets.current_capital,
                    retained_earnings: infoWidgets.retained_earnings,
                    retained_profitability: infoWidgets.retained_profitability,
                    movements: data.length
                });
                setData(datos);
            }else{
                setData([]);
            }
        }
        setLoading(false);
    };

    // Configuración de widgets
    const widgets = [
        {
            title: 'Capital actual',
            value: HandlerApp.formatCurrency(totals.current_capital),
            icon: DollarSign,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Ganancias acumuladas',
            value: HandlerApp.formatCurrency(totals.retained_earnings),
            icon: TrendingUp,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Rentabilidad acumulada',
            value: HandlerApp.formatPercentage(totals.retained_profitability),
            icon: TrendingUp,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Movimientos',
            value: totals.movements -1,
            icon: ArrowLeftRight,
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
                    {row.start_date ? row.start_date : 'TOTAL:'}
                </span>
            ),
        },
        {
            name: 'Capital inicial',
            selector: row => row.init_capital,
            sortable: true,
            cell: row => HandlerApp.formatCurrency(row.init_capital)
        },
        {
            name: 'Capital actual',
            wrap: true,
            selector: row => row.current_capital,
            sortable: true,
            cell: row => HandlerApp.formatCurrency(row.current_capital)
        },
        {
            name: 'Retiros o liquidación',
            selector: row => row.withdraw,
            sortable: true,
            cell: row => HandlerApp.formatCurrency(row.withdraw)
        },
        {
            name: 'Rentabilidad actual',
            selector: row => row.current_profitability,
            wrap: true,
            sortable: true,
            cell: row => HandlerApp.formatPercentage(row.current_profitability)
        },
        {
            name: 'Ganancia acumulada',
            wrap: true,
            selector: row => row.retained_earnings,
            sortable: true,
            cell: row => HandlerApp.formatCurrency(row.retained_earnings)
        },
        {
            name: 'Rentabilidad acumulada',
            wrap: true,
            selector: row => row.retained_profitability,
            sortable: true,
            cell: row => HandlerApp.formatPercentage(row.retained_profitability)
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

    return (
        isAdmin && <div>
            {/* Boton ir hacia atras */}
            <div className="flex justify-start gap-2">
                <button onClick={() => navigate('/users')} className="flex items-center gap-2 text-gray-900 font-semibold text-lg py-4 px-4 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                    Regresar
                </button>
            </div>
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
                        <h2 className="text-lg font-semibold text-gray-900">Transacciones de {name}</h2>
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
                        paginationRowsPerPageOptions={[30, 50, 100]}
                        paginationPerPage={30}
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
        </div>
    );
};

export default UserDetail;