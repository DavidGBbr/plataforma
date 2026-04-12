import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Dashboard = () => {
    const { registros, loading } = useData();
    const { openRegistry } = useOutletContext();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Desktop Header */}
            <header className="hidden md:flex bg-white border-b border-stone-200/60 -mx-8 -mt-8 px-8 h-20 items-center mb-8">
                <h2 className="font-heading text-3xl font-bold text-stone-800">Lista de Presenças</h2>
            </header>

            <div className="bg-white rounded-2xl border border-stone-200/60 overflow-x-auto shadow-sm shadow-stone-200/50">
                <table className="min-w-[800px] w-full">
                    <thead>
                        <tr className="border-b border-stone-100">
                            <th className="px-6 py-4 text-xs uppercase tracking-wider text-left font-semibold text-stone-400">Turma</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-wider text-left font-semibold text-stone-400">Professor</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-wider text-left font-semibold text-stone-400">Data</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-wider text-center font-semibold text-stone-400">Presentes</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-wider text-center font-semibold text-stone-400">Visitantes</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-wider text-right font-semibold text-stone-400">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {registros.map((reg) => (
                            <tr key={reg.id} className="hover:bg-surface-warm/50 transition-colors duration-150">
                                <td className="px-6 py-4 font-semibold text-stone-800">{reg.turma}</td>
                                <td className="px-6 py-4 text-stone-600">{reg.professor}</td>
                                <td className="px-6 py-4 text-stone-400 text-sm">{reg.data}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-primary-light text-primary">
                                        {reg.presentes}/{reg.total}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-stone-400 truncate max-w-[200px]">
                                    {reg.visitantes}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => openRegistry(reg)}
                                        className="text-primary font-semibold hover:text-primary-hover text-sm transition"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {registros.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-stone-400">
                                    <span className="material-symbols-outlined text-4xl text-stone-300 block mb-2">inbox</span>
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Dashboard;
