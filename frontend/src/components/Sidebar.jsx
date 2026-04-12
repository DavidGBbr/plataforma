import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, onLogout, onOpenNewRegistry }) => {
    const { user } = useAuth();

    const userName = user?.name || user?.username || 'Usuário';
    const userEmail = user?.email || '';
    const avatarUrl = user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=B45309&color=fff&bold=true`;
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navLinkClass = (path) => {
        const base = 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150';
        if (isActive(path)) {
            return `${base} bg-primary/15 text-primary`;
        }
        return `${base} text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]`;
    };

    return (
        <>
            {/* OVERLAY */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            {/* SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-sidebar-dark z-40
                    transform transition-transform duration-300 ease-out md:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    border-r border-white/[0.04]`}
            >
                <div className="p-5 flex flex-col h-full">

                    {/* LOGO */}
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl">church</span>
                        </div>
                        <div>
                            <h1 className="font-heading text-xl font-bold text-white tracking-tight">IBRC</h1>
                        </div>
                    </div>

                    {/* NEW RECORD BUTTON */}
                    <button
                        onClick={() => {
                            onOpenNewRegistry();
                            onClose();
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Novo Registro
                    </button>

                    {/* NAV */}
                    <nav className="flex flex-col gap-1 flex-1">
                        <Link to="/" className={navLinkClass('/')} onClick={onClose}>
                            <span className="material-symbols-outlined text-xl">list_alt</span>
                            Lista de Presenças
                        </Link>

                        <Link to="/turmas" className={navLinkClass('/turmas')} onClick={onClose}>
                            <span className="material-symbols-outlined text-xl">groups</span>
                            Turmas
                        </Link>

                        <Link to="/configuracoes" className={navLinkClass('/configuracoes')} onClick={onClose}>
                            <span className="material-symbols-outlined text-xl">settings</span>
                            Configurações
                        </Link>
                    </nav>

                    {/* PROFILE */}
                    <div className="border-t border-white/[0.06] pt-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition">
                            <div
                                className="size-9 rounded-full bg-cover bg-center flex-shrink-0 ring-2 ring-white/10"
                                style={{ backgroundImage: `url('${avatarUrl}')` }}
                            />

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-stone-200 truncate">{userName}</p>
                                <p className="text-xs text-stone-500 truncate">{userEmail}</p>
                            </div>

                            <button
                                onClick={onLogout}
                                className="material-symbols-outlined text-xl text-stone-600 hover:text-red-400 transition p-1"
                                title="Sair"
                            >
                                logout
                            </button>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
