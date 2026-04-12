import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ModalFotoPerfil = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [tab, setTab] = useState('upload');
    const [preview, setPreview] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [urlError, setUrlError] = useState('');
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const userName = user?.name || user?.username || 'Usuário';
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=B45309&color=fff&bold=true`;

    useEffect(() => {
        if (isOpen) {
            setTab('upload');
            setPreview(user?.avatar || '');
            setUrlInput('');
            setUrlError('');
        }
    }, [isOpen, user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setUrlError('Selecione um arquivo de imagem válido.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setUrlError('A imagem deve ter no máximo 2MB.');
            return;
        }

        setUrlError('');
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleUrlChange = (e) => {
        const val = e.target.value;
        setUrlInput(val);
        setUrlError('');
        if (val.trim()) setPreview(val.trim());
    };

    const handleUrlError = () => {
        setUrlError('URL inválida ou imagem não encontrada.');
        setPreview('');
    };

    const handleSave = async () => {
        if (!preview) {
            setUrlError('Nenhuma imagem selecionada.');
            return;
        }
        setSaving(true);
        try {
            await updateUser({ avatar: preview });
            onClose();
        } catch {
            setUrlError('Erro ao salvar a foto. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async () => {
        setSaving(true);
        try {
            await updateUser({ avatar: null });
            setPreview('');
            onClose();
        } catch {
            setUrlError('Erro ao remover a foto.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl border border-stone-200/60 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-sidebar-dark">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/15 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">add_a_photo</span>
                        </div>
                        <h2 className="text-white font-semibold text-sm">Foto de Perfil</h2>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="p-5 space-y-4">

                    {/* Preview */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative group">
                            <div
                                className="size-24 rounded-2xl bg-cover bg-center ring-2 ring-stone-200 transition-transform group-hover:scale-105"
                                style={{ backgroundImage: `url('${preview || fallbackAvatar}')` }}
                            />
                            <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                            </div>
                        </div>
                        <p className="text-xs text-stone-400">Pré-visualização</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex rounded-xl bg-stone-100 p-1 gap-1">
                        <button
                            onClick={() => { setTab('upload'); setUrlError(''); }}
                            className={`flex-1 text-xs font-semibold py-2.5 rounded-lg transition-all ${tab === 'upload'
                                ? 'bg-white text-stone-800 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm align-middle mr-1">upload</span>
                            Upload
                        </button>
                        <button
                            onClick={() => { setTab('url'); setUrlError(''); }}
                            className={`flex-1 text-xs font-semibold py-2.5 rounded-lg transition-all ${tab === 'url'
                                ? 'bg-white text-stone-800 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm align-middle mr-1">link</span>
                            URL
                        </button>
                    </div>

                    {/* Tab Content */}
                    {tab === 'upload' ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-stone-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-primary-light/30"
                        >
                            <span className="material-symbols-outlined text-4xl text-stone-300">image</span>
                            <p className="text-xs font-semibold text-stone-500">Clique para selecionar</p>
                            <p className="text-[10px] text-stone-400">PNG, JPG, WEBP — máx. 2MB</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">URL da imagem</label>
                            <input
                                type="url"
                                value={urlInput}
                                onChange={handleUrlChange}
                                placeholder="https://exemplo.com/foto.jpg"
                                className="w-full rounded-xl border border-stone-200 text-sm px-3 py-2.5 text-stone-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
                            />
                            {urlInput.trim() && (
                                <img src={urlInput.trim()} alt="" className="hidden" onError={handleUrlError} onLoad={() => setUrlError('')} />
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {urlError && (
                        <div className="flex items-center gap-2 text-xs text-danger bg-red-50 border border-red-200/60 rounded-lg px-3 py-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {urlError}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                        {user?.avatar && (
                            <button
                                onClick={handleRemove}
                                disabled={saving}
                                className="px-3 py-2 text-xs font-semibold text-danger hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Remover
                            </button>
                        )}
                        <div className="flex-1" />
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-700 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !preview}
                            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
                        >
                            {saving
                                ? <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Salvando...</>
                                : <><span className="material-symbols-outlined text-sm">check</span> Confirmar</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalFotoPerfil;
