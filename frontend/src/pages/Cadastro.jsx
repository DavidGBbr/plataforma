import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await authService.register({
                name: nome.trim(),
                email: email.trim(),
                password: senha,
            });

            setSuccess(result.message || 'Cadastro realizado com sucesso!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sidebar-dark relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px'
            }} />

            <div className="w-full max-w-sm relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">church</span>
                    </div>
                    <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Cadastro IBRC</h1>
                    <p className="text-stone-500 text-sm mt-1">Crie sua conta para acessar o sistema</p>
                </div>

                <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7">
                    {/* Voltar */}
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1 text-stone-500 hover:text-primary text-sm font-medium transition mb-5"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Voltar ao login
                    </Link>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Nome completo</label>
                            <input
                                type="text"
                                required
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                                placeholder="Seu nome"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Senha</label>
                            <input
                                type="password"
                                required
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2.5">
                                <span className="material-symbols-outlined text-base">check_circle</span>
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-all duration-150 active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-stone-500 mt-5">
                        Já tem conta?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:text-primary-hover transition">Entrar</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;
