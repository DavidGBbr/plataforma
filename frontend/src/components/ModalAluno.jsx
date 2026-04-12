import { useState, useEffect } from 'react';
import { useData, TURMAS_DISPONIVEIS } from '../context/DataContext';

const ModalAluno = ({ isOpen, onClose, alunoToEdit, currentTurma }) => {
    const { addAluno, updateAluno, alunosData } = useData();
    const [nome, setNome] = useState('');
    const [turma, setTurma] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (alunoToEdit) {
                setNome(alunoToEdit.nome);
                setTurma(currentTurma);
            } else {
                setNome('');
                setTurma(currentTurma || TURMAS_DISPONIVEIS[0]);
            }
        }
    }, [isOpen, alunoToEdit, currentTurma, alunosData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome.trim()) {
            alert('Informe o nome');
            return;
        }

        try {
            if (alunoToEdit) {
                await updateAluno(currentTurma, alunoToEdit.nome, turma, nome);
            } else {
                await addAluno(turma, nome);
            }
            onClose();
        } catch (err) {
            alert('Erro ao processar aluno. Tente novamente.');
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full rounded-xl border border-stone-200 text-sm px-4 py-3 text-stone-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition bg-white";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl border border-stone-200/60 shadow-xl p-6 space-y-5">
                <div className="flex justify-between items-center">
                    <h2 className="font-heading text-xl font-bold text-stone-800">{alunoToEdit ? 'Editar Aluno' : 'Novo Aluno'}</h2>
                    <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Nome do aluno</label>
                        <input type="text" required value={nome} onChange={e => setNome(e.target.value)} className={inputClass} placeholder="Nome completo" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">Turma</label>
                        <select value={turma} onChange={e => setTurma(e.target.value)} className={inputClass}>
                            <option value="">Selecione...</option>
                            {TURMAS_DISPONIVEIS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-stone-500 hover:text-stone-700 transition">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-sm shadow-primary/20">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAluno;
