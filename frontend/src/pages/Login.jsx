import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const success = await login(email, password);
            if (success === true) {
                navigate('/');
            } else if (typeof success === 'string') {
                setError(success);
            } else {
                setError('E-mail ou senha inválidos');
            }
        } catch (err) {
            setError('Erro ao conectar ao servidor');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sidebar-dark relative overflow-hidden">
            {/* Subtle grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px'
            }} />

            <div className="w-full max-w-sm relative z-10">
                {/* Logo mark */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">church</span>
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-white tracking-tight">IBRC</h1>
                    <p className="text-stone-500 text-sm mt-1">Igreja Batista Regular do Calvário</p>
                </div>

                <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                                placeholder="seu@email.com"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Senha</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                                placeholder="••••••"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/20"
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="text-center text-sm text-stone-500 mt-5">
                        Não tem conta?{' '}
                        <Link to="/cadastro" className="text-primary font-semibold hover:text-primary-hover transition">Cadastrar</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
