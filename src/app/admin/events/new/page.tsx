"use client";

import { useState } from "react";
import { ArrowLeft, Save, Calendar, Tag, Link as LinkIcon, Lock, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Casamento");
  const [coverImage, setCoverImage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const router = useRouter();

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
        alert("Imagem de capa enviada com sucesso!");
      } else {
        alert("Erro ao enviar imagem de capa.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão no upload da capa.");
    } finally {
      setUploadingCover(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-"); // replace spaces with hyphens
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !date || !category) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          date,
          category,
          coverImage: coverImage || "/mock/wedding.jpg",
          isPrivate,
          password: isPrivate ? password : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Evento criado com sucesso!");
        router.push(`/admin/events/${data.id}`);
      } else {
        alert(data.error || "Erro ao criar evento.");
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-8 min-h-screen">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Eventos
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Criar Novo Evento</h1>
        <p className="text-white/40 text-sm mb-8">Defina os detalhes iniciais da nova galeria de fotos.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-8 space-y-6 border-white/5">
            {/* Nome do Evento */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nome do Evento *</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                placeholder="Ex: Casamento Beatriz e Gustavo"
              />
            </div>

            {/* Link do Evento (Slug) */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" /> Link da Galeria (URL) *
              </label>
              <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-gold-500/50 transition-colors">
                <span className="bg-white/5 text-white/40 px-4 py-3 text-sm select-none border-r border-white/5">/events/</span>
                <input 
                  type="text" 
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent py-3 px-4 focus:outline-none text-white text-sm"
                  placeholder="casamento-beatriz-gustavo"
                />
              </div>
              <p className="text-[10px] text-white/30 mt-1.5">Este link será usado pelo cliente para acessar as fotos.</p>
            </div>

            {/* Grid Data e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Data do Evento *
                </label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white text-sm cursor-pointer"
                >
                  <option value="Casamento">Casamento</option>
                  <option value="Formatura">Formatura</option>
                  <option value="Aniversário">Aniversário</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Ensaio">Ensaio</option>
                </select>
              </div>
            </div>

            {/* Imagem de Capa */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Imagem de Capa</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                  placeholder="Ex: /mock/wedding.jpg ou faça upload"
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCoverUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingCover}
                  />
                  <button
                    type="button"
                    disabled={uploadingCover}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold py-3.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Escolher do PC
                  </button>
                </div>
              </div>
              
              {coverImage && (
                <div className="mt-4 p-2 bg-white/5 border border-white/10 rounded-xl max-w-[200px] overflow-hidden">
                  <p className="text-[9px] text-white/30 mb-2">Prévia da Capa:</p>
                  <img src={coverImage} alt="Preview Capa" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
              
              <p className="text-[10px] text-white/30 mt-1.5">Faça o upload do seu computador ou digite uma URL. Deixe em branco para usar uma capa padrão.</p>
            </div>

            {/* Evento Privado */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gold-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Galeria Privada</h4>
                    <p className="text-xs text-white/40">Exigir senha para que clientes visualizem as fotos.</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-5 h-5 accent-gold-500 cursor-pointer"
                />
              </div>

              {isPrivate && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Senha de Acesso</label>
                  <input 
                    type="password" 
                    required={isPrivate}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                    placeholder="Defina a senha da galeria"
                  />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full btn-gold !py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Criando evento..." : "Criar Evento e Gerenciar Fotos"}
          </button>
        </form>
      </div>
    </div>
  );
}
