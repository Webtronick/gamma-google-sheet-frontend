
const Loader = () => {
    return (
        <div className="min-h-screen bg-gray-50 bg-opacity-50 z-50 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
        </div>
    );
};

export default Loader;