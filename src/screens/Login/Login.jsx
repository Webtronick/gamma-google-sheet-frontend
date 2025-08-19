import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser, loading, setLoading, setIsAdmin, setInfoUser, isLogin, setIsLogin } = useAuth();

    const [error, setError]                 = useState('');
    const [showPassword, setShowPassword]   = useState(false);
    const [formData, setFormData]           = useState({
        email: '',
        password: ''
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { email, password } = formData;
        
        const result = await signIn(email, password);
        if (result.success) {
            localStorage.setItem('token', result.data?.session?.access_token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            setUser(result.data.user);
            navigate("/");
        }else{
            setError(result.error);
        }
        setLoading(false);
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            // Esperar a que el perfil esté disponible inmediatamente tras el login
            const profile = data?.user ? await fetchUserProfile(data.user.id) : null;
            const role = profile?.role ?? null;

            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('role', role);

            return { success: true, data, profile, role };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    };


    return (
        <div className="min-h-screen flex flex-row">
            <div className="hidden sm:flex w-1/4 sm:w-2/5 min-h-screen bg-white">
                <div className="flex min-h-screen w-full">
                    <div className="flex flex-col justify-center w-full">
                        <h1 className="text-4xl sm:text-3xl font-bold text-center w-full text-blue-900 mb-2 p-2">Bienvenido al Futuro de las Inversiones</h1>
                        <div className='h-1/3 flex justify-center items-center pb-10'>
                            <img src="/logo.png" alt="Logo" className="h-48 mb-8 p-4" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="sm:w-3/5 md:w-3/4 w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 from-25% via-teal-50 via-50% to-yellow-50 to-100%"> 
                <div className="sm:hidden w-full p-4 h-1/3">
                    <div className="flex flex-col items-center align-center justify-center h-full">
                        <img src="/logo.png" alt="Logo" className="h-24 mb-2" />
                        <h1 className="text-3xl font-bold text-blue-900">El Futuro de las Inversiones</h1>
                    </div>
                </div>
                <div className="h-3/4 sm:w-5/6 md:w-2/3 lg:w-2/4 sm:h-full flex justify-center items-start sm:items-center align-center mx-2">
                    <div className="bg-white w-full rounded-xl shadow-lg pt-8 px-4 pb-4 sm:pt-8 sm:px-4 md:px-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-blue-900 mb-2">
                                Bienvenido de vuelta
                            </h1>
                            <p className="text-gray-600">
                                Inicia sesión para continuar
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 pb-4" autoComplete="off">
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Email"
                                        required
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password*
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
                                        placeholder="Password"
                                        required
                                        disabled={loading}
                                        autoComplete="current-password"
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

                            <button
                                type="submit"
                                className="w-full bg-blue-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            Powered by <span className="font-bold text-blue-800">Webtronick</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;