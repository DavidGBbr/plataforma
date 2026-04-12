import { useState, useMemo } from 'react';
import { useData, normalizeDate } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ModalTurma from '../components/ModalTurma';

const Turma = () => {
    const { alunosData, registros } = useData();
    const { user } = useAuth();

    const [selectedTurma, setSelectedTurma] = useState(null);
    const [activeTab, setActiveTab] = useState('classes');
    const [dataFiltro, setDataFiltro] = useState('');

    const turmas = Object.keys(alunosData).map(turmaName => {
        const record = registros.find(r => r.turma === turmaName);
        return {
            turma: turmaName,
            professor: record?.professor || 'Não atribuído',
            totalAlunos: alunosData[turmaName].length
        };
    });

    const registrosFiltrados = useMemo(() => {
        let filtered = registros;
        if (dataFiltro) {
            const normalizedFiltro = normalizeDate(dataFiltro);
            filtered = filtered.filter(r => r.data === normalizedFiltro);
        }
        return filtered;
    }, [registros, dataFiltro, user]);

    const calcularResumo = (lista) => {
        let presentes = 0;
        let ausentes = 0;
        let visitantes = 0;

        lista.forEach(r => {
            let qtdPresentes = 0;
            if (typeof r.presentes === 'number') {
                qtdPresentes = r.presentes;
            } else if (Array.isArray(r.presentes)) {
                qtdPresentes = r.presentes.length;
            } else if (typeof r.presentes === 'string') {
                qtdPresentes = r.presentes.split(',').filter(Boolean).length;
            }
            presentes += qtdPresentes;

            if (typeof r.ausentes === 'number' && r.ausentes > 0) {
                ausentes += r.ausentes;
            } else if (Array.isArray(r.ausentes)) {
                ausentes += r.ausentes.length;
            } else if (typeof r.ausentes === 'string' && r.ausentes) {
                ausentes += r.ausentes.split(',').filter(Boolean).length;
            } else {
                const total = typeof r.total === 'number' ? r.total : 0;
                ausentes += Math.max(0, total - qtdPresentes);
            }

            if (r.visitantes && r.visitantes.trim() !== '' && r.visitantes.trim() !== '-') {
                visitantes += r.visitantes.split(',').map(v => v.trim()).filter(Boolean).length;
            }
        });

        return {
            presentes,
            ausentes,
            visitantes,
            totalPresentes: presentes + visitantes
        };
    };

    const resumoGeral = calcularResumo(registrosFiltrados);

    const resumoPorTurma = Object.keys(alunosData).map(turma => {
        const registrosTurma = registrosFiltrados.filter(r => r.turma === turma);
        return {
            turma,
            ...calcularResumo(registrosTurma)
        };
    });

    return (
        <div className="p-4 md:p-8">
            {/* HEADER + TABS */}
            <header className="flex flex-col md:flex-row bg-white border border-stone-200/60 rounded-2xl px-6 py-5 md:px-8 md:py-6 mb-6 md:mb-8 items-center justify-between gap-4 md:gap-0 shadow-sm shadow-stone-200/50">
                <div className="text-center md:text-left">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-stone-800">Turmas</h1>
                    <p className="text-sm text-stone-400 mt-0.5">
                        Relatórios e gerenciamento
                    </p>
                </div>

                <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('classes')}
                        className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${activeTab === 'classes'
                            ? 'bg-white text-stone-800 shadow-sm'
                            : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        Classes
                    </button>

                    <button
                        onClick={() => setActiveTab('relatorio')}
                        className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${activeTab === 'relatorio'
                            ? 'bg-white text-stone-800 shadow-sm'
                            : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        Relatório
                    </button>
                </div>
            </header>

            {/* CLASSES */}
            {activeTab === 'classes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {turmas.map(t => (
                        <div
                            key={t.turma}
                            className="bg-white rounded-2xl border border-stone-200/60 p-6 space-y-4 hover:border-stone-300 hover:shadow-md hover:shadow-stone-200/50 transition-all duration-200 group"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="font-heading text-xl font-bold text-stone-800">{t.turma}</h3>
                                <span className="inline-flex items-center justify-center size-9 rounded-xl bg-primary-light text-primary">
                                    <span className="material-symbols-outlined text-lg">groups</span>
                                </span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-stone-400">
                                    Professor: <span className="text-stone-600 font-medium">{t.professor}</span>
                                </p>
                                <p className="text-sm text-stone-400">
                                    Alunos: <span className="text-stone-600 font-medium">{t.totalAlunos}</span>
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedTurma(t)}
                                className="text-primary font-semibold text-sm hover:text-primary-hover transition group-hover:translate-x-0.5 inline-flex items-center gap-1"
                            >
                                Gerenciar Turma
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* RELATÓRIO */}
            {activeTab === 'relatorio' && (
                <div className="space-y-6">
                    {/* FILTRO */}
                    <div className="bg-white rounded-2xl border border-stone-200/60 p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm shadow-stone-200/50">
                        <label className="font-semibold text-stone-700 text-sm">Filtrar por data:</label>
                        <input
                            type="date"
                            value={dataFiltro}
                            onChange={e => setDataFiltro(e.target.value)}
                            className="border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 w-full sm:w-auto transition"
                        />
                    </div>

                    {/* RESUMO GERAL */}
                    <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm shadow-stone-200/50">
                        <h2 className="font-heading text-xl font-bold text-stone-800 mb-5">Resumo Geral</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ResumoCard label="Presentes" value={resumoGeral.presentes} icon="check_circle" />
                            <ResumoCard label="Ausentes" value={resumoGeral.ausentes} icon="cancel" variant="muted" />
                            <ResumoCard label="Visitantes" value={resumoGeral.visitantes} icon="person_add" variant="accent" />
                            <ResumoCard label="Total Presentes" value={resumoGeral.totalPresentes} icon="groups" variant="primary" />
                        </div>
                    </div>

                    {/* RESUMO POR TURMA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {resumoPorTurma.map(r => (
                            <div key={r.turma} className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm shadow-stone-200/50">
                                <h3 className="font-heading text-lg font-bold text-stone-800 mb-4">{r.turma}</h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-400">Presentes</span>
                                        <span className="font-semibold text-stone-700">{r.presentes}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-400">Ausentes</span>
                                        <span className="font-semibold text-stone-700">{r.ausentes}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-400">Visitantes</span>
                                        <span className="font-semibold text-stone-700">{r.visitantes}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                                        <span className="text-primary font-semibold">Total Presentes</span>
                                        <span className="font-bold text-primary text-lg">{r.totalPresentes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ModalTurma
                isOpen={!!selectedTurma}
                onClose={() => setSelectedTurma(null)}
                turmaInfo={selectedTurma}
            />
        </div>
    );
};

const ResumoCard = ({ label, value, icon, variant = 'default' }) => {
    const styles = {
        default: 'bg-surface-warm border-stone-200/60 text-stone-800',
        muted: 'bg-stone-50 border-stone-200/60 text-stone-600',
        accent: 'bg-accent-light border-accent/20 text-accent',
        primary: 'bg-primary text-white border-primary',
    };

    const iconColor = {
        default: 'text-stone-400',
        muted: 'text-stone-300',
        accent: 'text-accent',
        primary: 'text-white/70',
    };

    return (
        <div className={`rounded-xl p-4 border transition ${styles[variant]}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-base ${iconColor[variant]}`}>{icon}</span>
                <p className={`text-xs font-medium uppercase tracking-wider ${variant === 'primary' ? 'text-white/70' : 'text-stone-400'}`}>{label}</p>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
};

export default Turma;
