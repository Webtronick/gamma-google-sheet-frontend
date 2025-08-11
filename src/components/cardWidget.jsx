
const CardWidget = ({ title, value, icon: Icon, bgColor, textColor, iconColor }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
};

export default CardWidget; 