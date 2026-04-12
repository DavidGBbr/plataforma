import { useState, useEffect } from 'react';
import { useData, TURMAS_DISPONIVEIS } from '../context/DataContext';

const ModalRegistro = ({ isOpen, onClose, registroToEdit }) => {
    const {
        alunosData,
        addRegistro,
        updateRegistro,
        deleteRegistro,
        getAlunosByTurma
    } = useData();

    const [turma, setTurma] = useState('');
    const [data, setData] = useState('');
    const [professor, setProfessor] = useState('');
    const [visitantes, setVisitantes] = useState('');

    const [alunosList, setAlunosList] = useState([]);
    const [checkedAlunos, setCheckedAlunos] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (registroToEdit) {
                setTurma(registroToEdit.turma);
                setData(registroToEdit.data);
                setProfessor(registroToEdit.professor);
                setVisitantes(registroToEdit.visitantes === '-' ? '' : registroToEdit.visitantes);

                const alunos = getAlunosByTurma(registroToEdit.turma);
                setAlunosList(alunos);

                const checks = {};
                alunos.forEach((a, i) => {
                    checks[a] = i < registroToEdit.presentes;
                });
                setCheckedAlunos(checks);
            } else {
                setTurma('');
                setData(new Date().toISOString().split('T')[0]);
                setProfessor('');
                setVisitantes('');
                setAlunosList([]);
                setCheckedAlunos({});
            }
        }
    }, [isOpen, registroToEdit, alunosData]);

    const handleTurmaChange = (e) => {
        const selectedTurma = e.target.value;
        setTurma(selectedTurma);

        if (selectedTurma) {
            const alunos = getAlunosByTurma(selectedTurma);
            setAlunosList(alunos);
            const checks = {};
            alunos.forEach(a => (checks[a] = false));
            setCheckedAlunos(checks);
        } else {
            setAlunosList([]);
        }
    };

    const handleMonitorChange = (nome) => {
        setCheckedAlunos(prev => ({
            ...prev,
            [nome]: !prev[nome]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const presentesList = Object.keys(checkedAlunos).filter(k => checkedAlunos[k]);

        const registroData = {
            turma,
            professor,
            data,
            presentes: presentesList.length,
            ausentes: alunosList.length - presentesList.length,
            total: alunosList.length,
            visitantes: visitantes || '-'
        };

        try {
            if (registroToEdit) {
                await updateRegistro({ id: registroToEdit.id, ...registroData });
            } else {
                await addRegistro(registroData);
            }
            onClose();
        } catch (err) {
            alert('Erro ao salvar registro. Tente novamente.');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRegistro(registroToEdit.id);
            setConfirmDelete(false);
            onClose();
        } catch (err) {
            alert('Erro ao excluir registro.');
        }
    };

    if (!isOpen) return null;

    const inputClass = "rounded-xl border border-stone-200 text-sm px-3 py-2.5 text-stone-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition bg-white";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl border border-stone-200/60 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                    <h3 className="font-heading text-lg font-bold text-stone-800">
                        {registroToEdit ? 'Editar Registro' : 'Novo Registro de Chamada'}
                    </h3>
                    <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="formRegistro" className="space-y-5" onSubmit={handleSubmit}>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Turma</label>
                                <select required value={turma} onChange={handleTurmaChange} className={inputClass}>
                                    <option value="">Selecione...</option>
                                    {TURMAS_DISPONIVEIS.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Data</label>
                                <input type="date" required value={data} onChange={e => setData(e.target.value)} className={inputClass} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Professor Responsável</label>
                            <input type="text" required value={professor} onChange={e => setProfessor(e.target.value)} placeholder="Nome do professor" className={`w-full ${inputClass}`} />
                        </div>

                        {alunosList.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Chamada de Alunos</label>
                                <div className="grid grid-cols-1 gap-1 bg-surface-warm p-3 rounded-xl border border-stone-200/60 max-h-50 overflow-y-auto custom-scrollbar">
                                    {alunosList.map(aluno => (
                                        <label key={aluno} className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-white cursor-pointer transition">
                                            <span className="text-sm text-stone-700">{aluno}</span>
                                            <input
                                                type="checkbox"
                                                className="accent-primary w-4 h-4 rounded"
                                                checked={!!checkedAlunos[aluno]}
                                                onChange={() => handleMonitorChange(aluno)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Visitantes</label>
                            <textarea
                                rows="2"
                                value={visitantes}
                                onChange={e => setVisitantes(e.target.value)}
                                className={`w-full ${inputClass}`}
                                placeholder="Nomes dos visitantes (separados por vírgula)"
                            />
                        </div>

                    </form>
                </div>

                <div className="px-6 py-4 bg-surface-warm/50 border-t border-stone-100 flex justify-between items-center">
                    {registroToEdit && (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="text-danger font-semibold text-sm hover:text-danger-hover transition"
                        >
                            Excluir Registro
                        </button>
                    )}

                    <button
                        type="submit"
                        form="formRegistro"
                        className="ml-auto px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-sm shadow-primary/20"
                    >
                        Salvar Registro
                    </button>
                </div>

            </div>

            {confirmDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-stone-200/60 shadow-xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-danger">warning</span>
                            </div>
                            <h4 className="font-heading text-lg font-bold text-danger">Confirmar exclusão</h4>
                        </div>
                        <p className="text-sm text-stone-500">
                            Tem certeza que deseja excluir este registro? Essa ação não poderá ser desfeita.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 text-sm font-semibold text-stone-500 hover:text-stone-700 transition">
                                Cancelar
                            </button>
                            <button onClick={handleDelete} className="px-5 py-2 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger-hover transition">
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalRegistro;
