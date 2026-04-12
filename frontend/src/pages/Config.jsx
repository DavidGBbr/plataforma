import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ModalFotoPerfil from '../components/ModalFotoPerfil';

const Config = () => {
    const { user, updateUser, logout } = useAuth();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    useEffect(() => {
        if (user) {
            setNome(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            updateUser({ avatar: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = () => {
        updateUser({ name: nome, email });
        alert('Perfil atualizado!');
    };

    const handleUpdatePassword = () => {
        if (!senha || senha.length < 6) {
            alert('Senha mínima de 6 caracteres');
            return;
        }
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem');
            return;
        }
        alert('Senha atualizada (simulação)');
        setSenha('');
        setConfirmarSenha('');
    };

    const confirmDeleteAccount = () => {
        setShowDeleteModal(false);
        sessionStorage.clear();
        logout();
    };

    const inputClass = "w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition bg-white";

    return (
        <div className="p-4 md:p-8">
            <header className="hidden md:flex bg-white border-b border-stone-200/60 -mx-8 -mt-8 px-8 h-20 items-center mb-8">
                <h2 className="font-heading text-3xl font-bold text-stone-800">Configurações</h2>
            </header>

            <div className="max-w-3xl mx-auto space-y-6">

                {/* PERFIL */}
                <section className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm shadow-stone-200/50">
                    <h2 className="font-heading text-xl font-bold text-stone-800 mb-5">Perfil</h2>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setShowAvatarModal(true)}
                            className="relative group focus:outline-none"
                            title="Alterar foto de perfil"
                        >
                            <div
                                className="size-20 rounded-2xl bg-stone-100 bg-cover bg-center ring-2 ring-stone-200 transition-transform group-hover:scale-105"
                                style={{ backgroundImage: `url('${user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Usuário')}&background=B45309&color=fff&bold=true`}')` }}
                            />
                            <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                            </div>
                        </button>

                        <div>
                            <p className="font-semibold text-stone-800">{user?.name || 'Usuário'}</p>
                            <button
                                onClick={() => setShowAvatarModal(true)}
                                className="text-primary text-sm font-medium hover:text-primary-hover mt-0.5 transition"
                            >
                                Alterar foto
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Nome</label>
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <button
                        onClick={handleUpdateProfile}
                        className="mt-5 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-sm shadow-primary/20"
                    >
                        Salvar alterações
                    </button>
                </section>

                {/* SEGURANÇA */}
                <section className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm shadow-stone-200/50">
                    <h2 className="font-heading text-xl font-bold text-stone-800 mb-5">Segurança</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Nova senha</label>
                            <input type="password" placeholder="Mínimo 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Confirmar senha</label>
                            <input type="password" placeholder="Repita a senha" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <button
                        onClick={handleUpdatePassword}
                        className="mt-5 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-sm shadow-primary/20"
                    >
                        Atualizar senha
                    </button>
                </section>

                {/* ZONA DE PERIGO */}
                <section className="bg-white rounded-2xl border border-red-200/60 p-6">
                    <h2 className="font-heading text-xl font-bold text-danger mb-2">Zona de perigo</h2>
                    <p className="text-sm text-stone-400 mb-4">Esta ação é irreversível. Todos os seus dados serão removidos permanentemente.</p>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full border-2 border-dashed border-red-200 text-danger py-3 rounded-xl font-semibold text-sm hover:bg-red-50 hover:border-red-300 transition"
                    >
                        Excluir minha conta
                    </button>
                </section>
            </div>

            {/* MODAL FOTO DE PERFIL */}
            <ModalFotoPerfil
                isOpen={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
            />

            {/* MODAL DE CONFIRMAÇÃO EXCLUSÃO */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-stone-200/60 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-danger">warning</span>
                            </div>
                            <h3 className="font-heading text-xl font-bold text-danger">Excluir conta</h3>
                        </div>

                        <p className="text-stone-500 text-sm mb-6">
                            Essa ação é <strong className="text-stone-700">permanente</strong>.
                            Todos os seus dados serão removidos e não poderão ser recuperados.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 border border-stone-200 py-2.5 rounded-xl font-semibold text-sm text-stone-600 hover:bg-stone-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="flex-1 bg-danger text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-danger-hover transition"
                            >
                                Sim, excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Config;
