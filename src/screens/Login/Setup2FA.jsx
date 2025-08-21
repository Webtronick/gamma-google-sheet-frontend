import ToastSimple from '../../utils/ToastSimple';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Setup2FA = () => {
    const navigate  = useNavigate();
    const { user }  = useAuth();

    const [qrCode, setQrCode]           = useState('');
    const [secret, setSecret]           = useState('');
    const [code, setCode]               = useState('');
    const [isLoading, setIsLoading]     = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError]             = useState('');

    useEffect(() => {
        if(user !== false && user !== null){
            const fetchQRCode = async () => {
                try {
                    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/generate-qr-code', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            email: user.email,
                            user_id: user.id
                        })
                    });
                    
                    let data = await response.json();
                    if (data.success) {
                        data = data.data;
                        setQrCode(data.QR);
                        setSecret(data.secret);
                    } else {
                        setError(data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setError('Error de conexión con el servidor');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchQRCode();
        }
    }, [user.id]);

    const handleVerify = async (e) => {
        e.preventDefault();
        
        if (!code.trim()) {
            setError('Por favor ingresa el código de verificación');
            return;
        }
        
        setIsVerifying(true);
        setError('');
        
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/validate-2fa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    code: code.trim(),
                    secret: secret,
                    user_id: user.id
                })
            });
            
            let data = await response.json();
            if (data.success) {
                ToastSimple.toastSuccess('Autenticación en dos pasos configurada correctamente');
                navigate('/dashboard');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-lg pt-8 px-8 pb-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Configuración de Seguridad
                        </h1>
                        <p className="text-gray-600">
                            Escanea el código QR con tu aplicación de autenticación
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <img src={qrCode} alt="QR Code" />
                            </div>
                            
                            <p className="text-sm text-gray-600 text-center">
                                También puedes ingresar este código manualmente: 
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                    {secret}
                                </span>
                            </p>

                            <form onSubmit={handleVerify} className="space-y-4">
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                        Código de verificación
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="code"
                                            name="code"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={code}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setCode(value);
                                                if (error) setError('');
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            placeholder="123456"
                                            autoComplete="one-time-code"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isVerifying}
                                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-900 hover:bg-blue-800 ${isVerifying ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                            Verificando...
                                        </>
                                    ) : (
                                        <>
                                            Verificar y continuar
                                            <ArrowRight className="ml-2 -mr-1 w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                    ¿Necesitas ayuda? Contacta al soporte técnico
                </div>
            </div>
        </div>
    );
};

export default Setup2FA;
