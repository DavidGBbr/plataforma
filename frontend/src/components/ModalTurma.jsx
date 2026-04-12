import { useState } from 'react';
import { useData } from '../context/DataContext';
import ModalAluno from './ModalAluno';

const ModalTurma = ({ isOpen, onClose, turmaInfo }) => {
    const { getAlunosByTurma, removeAluno } = useData();

    const [isAlunoModalOpen, setIsAlunoModalOpen] = useState(false);
    const [alunoToEdit, setAlunoToEdit] = useState(null);

    if (!isOpen || !turmaInfo) return null;

    const alunos = getAlunosByTurma(turmaInfo.turma).sort((a, b) => a.localeCompare(b));

    const handleEditAluno = (aluno) => {
        setAlunoToEdit({ nome: aluno });
        setIsAlunoModalOpen(true);
    };

    const handleNewAluno = () => {
        setAlunoToEdit(null);
        setIsAlunoModalOpen(true);
    };

    const handleDeleteAluno = async (aluno) => {
        if (confirm('Deseja excluir este aluno da turma?')) {
            try {
                await removeAluno(turmaInfo.turma, aluno);
            } catch (err) {
                alert('Erro ao excluir aluno.');
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-xl rounded-2xl border border-stone-200/60 shadow-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center">
                        <h2 className="font-heading text-xl font-bold text-stone-800">{turmaInfo.turma}</h2>
                        <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition">
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    <p className="text-sm text-stone-400">Professor: <span className="text-stone-600 font-medium">{turmaInfo.professor}</span></p>

                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-stone-700 text-sm">Alunos ({alunos.length})</h3>
                        <button
                            onClick={handleNewAluno}
                            className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-primary-hover transition"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Novo Aluno
                        </button>
                    </div>

                    <ul className="space-y-1.5">
                        {alunos.map((aluno, index) => (
                            <li key={index} className="flex justify-between items-center px-4 py-3 border border-stone-100 rounded-xl hover:bg-surface-warm/50 transition group">
                                <span className="font-medium text-sm text-stone-700">{aluno}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handleEditAluno(aluno)}
                                        className="size-8 flex items-center justify-center text-stone-400 hover:text-primary hover:bg-primary-light rounded-lg transition"
                                        title="Editar"
                                    >
                                        <span className="material-symbols-outlined text-base">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAluno(aluno)}
                                        className="size-8 flex items-center justify-center text-stone-400 hover:text-danger hover:bg-red-50 rounded-lg transition"
                                        title="Excluir"
                                    >
                                        <span className="material-symbols-outlined text-base">delete</span>
                                    </button>
                                </div>
                            </li>
                        ))}
                        {alunos.length === 0 && (
                            <li className="text-center text-stone-400 text-sm py-8">
                                <span className="material-symbols-outlined text-3xl text-stone-300 block mb-2">person_off</span>
                                Nenhum aluno cadastrado.
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <ModalAluno
                isOpen={isAlunoModalOpen}
                onClose={() => setIsAlunoModalOpen(false)}
                currentTurma={turmaInfo.turma}
                alunoToEdit={alunoToEdit}
            />
        </>
    );
};

export default ModalTurma;
