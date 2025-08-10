import { User } from 'lucide-react';
import CardWidget from './cardWidget';
import UsersTable from './UsersTable';

const UsersContent = ({ data }) => {
    // Configuración de widgets
    const widgets = [
        {
            title: 'Total Usuarios',
            value: data.length,
            icon: User,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Usuarios Activos',
            value: data.filter(u => u.status === 'Active').length,
            icon: User,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Usuarios Inactivos',
            value: data.filter(u => u.status === 'Inactive').length,
            icon: User,
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600'
        },
        {
            title: 'Administradores',
            value: data.filter(u => u.role === 'Admin').length,
            icon: User,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
        }
    ];

    return (
        <>
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

            {/* Tabla de usuarios */}
            <UsersTable data={data} />
        </>
    );
};

export default UsersContent; 