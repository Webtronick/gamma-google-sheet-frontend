import ToastSimple from '../../utils/ToastSimple';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, ArrowRight, Eye, EyeOff, User } from 'lucide-react';

const SetPassword = () => {
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword]               = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const {user, setUser, loading, setLoading, setIsAdmin } = useAuth();

    console.log("====user", user);

    useEffect(() => {
        if(user !== false && user !== null){
            let configUser = localStorage.getItem(`${user.id}-configUser`);
            if(configUser === "false" || configUser === null){
                createProfile();
            }
        }
    }, [user.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const createProfile = async () => {
        console.log("Creando perfil");
        fetch(import.meta.env.VITE_BACKEND_URL + '/create-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                email: user.email,
                id: user.id,
                created_at: user.created_at
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                setIsAdmin(false);
            }
        })
        .catch(error => {
            console.error('Error al crear el perfil:', error);
        });
    }
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { password, password_confirm } = formData;

        if(password !== password_confirm) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }
        
        // Verifica si el usuario está autenticado a través del token del URL
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
            const { error } = await supabase.auth.updateUser({ password: password });
            
            if (error) {
                setError('Error al establecer la contraseña: ' + error.message);
                setLoading(false);
                return;
            } else {
                localStorage.setItem(`${user.id}-configUser`, true);
                updateInfoProfile();
            }
        } else {
            setError('No se pudo autenticar al usuario. El enlace puede haber expirado.');
            setLoading(false);
            return;
        }
    };

    const updateInfoProfile = async () => {
        fetch(import.meta.env.VITE_BACKEND_URL + '/update-info-profile/' + user.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                name: formData.name
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                navigate('/dashboard');
            }else{
                ToastSimple.toastError('Error actualizando información');
                setLoading(false);
            }
        })
        .catch(error => {
            console.error('Error al crear el perfil:', error);
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-lg pt-8 px-8 pb-4">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Bienvenido
                        </h1>
                        <p className="text-gray-600">
                            Por favor, completa tu información
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 pb-4" autoComplete="off">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-left text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Nombre"
                                    required
                                    minLength={3}
                                    maxLength={60}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-left text-gray-700 mb-2">
                                Contraseña *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Contraseña"
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                    minLength={6}
                                    
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-left text-gray-700 mb-2">
                                Confirmar contraseña *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    id="password_confirm"
                                    name="password_confirm"
                                    value={formData.password_confirm}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Confirmar contraseña"
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                >
                                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    Iniciar sesión
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                    <a href="https://webtronick.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 mt-2 block">
                        Powered by <span className="font-bold text-blue-600">Webtronick</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SetPassword;