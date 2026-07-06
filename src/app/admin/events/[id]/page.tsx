"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Edit, Save, Camera, Sparkles, AlertCircle, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add photo state
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoPrice, setNewPhotoPrice] = useState("15.00");
  const [addingPhoto, setAddingPhoto] = useState(false);

  // Bulk pricing state
  const [bulkPrice, setBulkPrice] = useState("");
  const [updatingBulk, setUpdatingBulk] = useState(false);

  // Edit event state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [savingEvent, setSavingEvent] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [params.id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
        setPhotos(data.photos || []);

        // Initialize edit states
        setName(data.name);
        setSlug(data.slug);
        setDate(data.date ? data.date.substring(0, 10) : "");
        setCategory(data.category);
        setCoverImage(data.coverImage || "");
        setIsPrivate(data.isPrivate);
        setPassword(data.password || "");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do evento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      const res = await fetch(`/api/events/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          date,
          category,
          coverImage,
          isPrivate,
          password: isPrivate ? password : null
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setEvent(updated);
        setShowEditForm(false);
        alert("Evento atualizado com sucesso!");
      } else {
        alert("Erro ao atualizar evento.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSavingEvent(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) {
      alert("Informe a URL da foto.");
      return;
    }

    setAddingPhoto(true);
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: params.id,
          s3Key: newPhotoUrl,
          price: parseFloat(newPhotoPrice) || 0
        })
      });

      if (res.ok) {
        const newPhoto = await res.json();
        setPhotos(prev => [...prev, newPhoto]);
        setNewPhotoUrl("");
        alert("Foto adicionada com sucesso!");
      } else {
        alert("Erro ao adicionar foto.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setAddingPhoto(false);
    }
  };

  const handleSavePhotoPrice = async (photoId: string, price: number) => {
    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price })
      });

      if (res.ok) {
        alert("Preço salvo com sucesso!");
      } else {
        alert("Erro ao salvar preço.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Excluir esta foto permanentemente?")) return;

    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      } else {
        alert("Erro ao excluir foto.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    }
  };

  const handleApplyBulkPrice = async () => {
    const priceVal = parseFloat(bulkPrice);
    if (isNaN(priceVal) || priceVal < 0) {
      alert("Insira um preço válido.");
      return;
    }

    if (!confirm(`Deseja alterar o preço de TODAS as ${photos.length} fotos deste evento para R$ ${priceVal.toFixed(2)}?`)) {
      return;
    }

    setUpdatingBulk(true);
    try {
      // Loop over all photos and update
      for (const p of photos) {
        await fetch(`/api/photos/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: priceVal })
        });
      }

      // Update local state
      setPhotos(prev => prev.map(p => ({ ...p, price: priceVal })));
      setBulkPrice("");
      alert("Preço de todas as fotos atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro durante a atualização em lote.");
    } finally {
      setUpdatingBulk(false);
    }
  };

  if (loading) return <div className="pt-40 text-center text-white">Carregando painel do evento...</div>;
  if (!event) return <div className="pt-40 text-center text-red-500">Evento não encontrado.</div>;

  return (
    <div className="pt-8 min-h-screen">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Eventos
      </Link>

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div>
          <span className="px-2.5 py-1 bg-gold-600/10 text-gold-500 text-[10px] font-bold rounded-full uppercase tracking-wider border border-gold-500/20">
            {event.category}
          </span>
          <h1 className="text-3xl font-bold mt-2">{event.name}</h1>
          <p className="text-white/40 text-xs mt-1">
            Data: {new Date(event.date).toLocaleDateString("pt-BR")} • Slug: {event.slug} • {photos.length} fotos cadastradas
          </p>
        </div>

        <button
          onClick={() => setShowEditForm(!showEditForm)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Edit className="w-4 h-4 text-gold-500" />
          {showEditForm ? "Cancelar Edição" : "Editar Detalhes do Evento"}
        </button>
      </div>

      {/* Edit Event Details Collapsible Form */}
      {showEditForm && (
        <div className="glass-card p-6 mb-8 border-gold-500/20 animate-in fade-in slide-in-from-top-3">
          <h3 className="text-md font-bold mb-4">Editar Detalhes do Evento</h3>
          <form onSubmit={handleUpdateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1">Nome do Evento</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1">Link do Evento (Slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-sm text-white"
                >
                  <option value="Casamento">Casamento</option>
                  <option value="Formatura">Formatura</option>
                  <option value="Aniversário">Aniversário</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Ensaio">Ensaio</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1">URL Imagem de Capa</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-sm text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingEvent}
                className="btn-gold !py-2 !px-5 text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {savingEvent ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Photos addition section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Add photo form */}
        <div className="glass-card p-6 border-white/5">
          <h3 className="text-md font-bold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-gold-500" />
            Adicionar Nova Foto
          </h3>

          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div>
              <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5" /> Caminho/URL da Imagem
              </label>
              <input
                type="text"
                required
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Ex: /mock/photo-0.jpg ou link da imagem"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-xs text-white"
              />
              <p className="text-[9px] text-white/30 mt-1">Dica: Você pode usar imagens locais do projeto como `/mock/photo-0.jpg`, `/mock/photo-1.jpg`, etc.</p>
            </div>

            <div>
              <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1">Preço Inicial (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={newPhotoPrice}
                onChange={(e) => setNewPhotoPrice(e.target.value)}
                placeholder="15.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={addingPhoto}
              className="w-full btn-gold !py-2.5 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              {addingPhoto ? "Adicionando..." : "Adicionar Foto à Galeria"}
            </button>
          </form>
        </div>

        {/* Bulk Pricing Tools */}
        <div className="glass-card p-6 border-white/5 lg:col-span-2">
          <h3 className="text-md font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500" />
            Ferramenta de Preço em Lote
          </h3>
          <p className="text-xs text-white/40 mb-4 leading-relaxed">
            Precisa ajustar todos os preços do evento de uma vez? Insira o valor desejado abaixo e ele será aplicado a todas as fotos deste evento de forma automática no banco.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-end max-w-md">
            <div className="flex-grow">
              <label className="block text-[10px] text-white/40 uppercase font-semibold mb-1">Novo Preço para Todas as Fotos</label>
              <input
                type="number"
                step="0.01"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                placeholder="12.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-gold-500/50 transition-colors text-xs text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyBulkPrice}
              disabled={updatingBulk || photos.length === 0}
              className="bg-gold-600 text-black text-xs font-bold py-3 px-6 rounded-xl hover:bg-gold-500 transition-all shrink-0 flex items-center gap-2 disabled:opacity-30 disabled:hover:bg-gold-600"
            >
              {updatingBulk ? "Atualizando..." : "Aplicar em Lote"}
            </button>
          </div>
          {photos.length === 0 && (
            <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Adicione fotos primeiro para poder usar esta ferramenta.
            </p>
          )}
        </div>
      </div>

      {/* Photos management list */}
      <div className="glass-card p-6 border-white/5">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Camera className="w-5 h-5 text-gold-500" />
          Fotos da Galeria ({photos.length})
        </h3>

        {photos.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            Nenhuma foto adicionada neste evento ainda. Use o formulário acima para cadastrar a primeira foto.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {photos.map((photo) => (
              <PhotoManagerCard
                key={photo.id}
                photo={photo}
                onSavePrice={handleSavePhotoPrice}
                onDelete={handleDeletePhoto}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoManagerCard({ photo, onSavePrice, onDelete }: { photo: any; onSavePrice: (id: string, price: number) => void; onDelete: (id: string) => void }) {
  const [priceStr, setPriceStr] = useState(photo.price.toFixed(2));

  useEffect(() => {
    setPriceStr(photo.price.toFixed(2));
  }, [photo.price]);

  return (
    <div className="bg-zinc-950/60 rounded-xl overflow-hidden border border-white/5 hover:border-gold-600/20 transition-all flex flex-col justify-between">
      <div className="relative aspect-square bg-zinc-900 overflow-hidden">
        <img
          src={photo.s3Key || "/mock/photo-0.jpg"}
          alt="Preview"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/mock/photo-0.jpg";
          }}
        />
        <button
          type="button"
          onClick={() => onDelete(photo.id)}
          className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white rounded-lg transition-all"
          title="Excluir Foto"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-2.5">
        <div>
          <label className="block text-[8px] text-white/30 uppercase font-semibold mb-0.5">Preço (R$)</label>
          <div className="flex gap-1">
            <input
              type="number"
              step="0.01"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-1 px-2 focus:outline-none focus:border-gold-500/50 transition-colors text-xs text-white text-right font-mono"
            />
            <button
              type="button"
              onClick={() => onSavePrice(photo.id, parseFloat(priceStr) || 0)}
              className="p-1 bg-gold-600 hover:bg-gold-500 text-black rounded-md transition-colors flex items-center justify-center shrink-0"
              title="Salvar preço"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="text-[9px] text-white/30 truncate">
          ID: {photo.id}
        </div>
      </div>
    </div>
  );
}
