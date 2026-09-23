import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  Plus, 
  Trash2, 
  Check, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { AutomationConfig, KeywordTrigger } from '../types';

interface DirectAutomationViewProps {
  automation: AutomationConfig;
  onUpdateAutomation: (newAutomation: AutomationConfig) => void;
  onOpenAiWithPrompt?: (type: string) => void;
}

export const DirectAutomationView: React.FC<DirectAutomationViewProps> = ({
  automation,
  onUpdateAutomation,
  onOpenAiWithPrompt,
}) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCommentReply, setNewCommentReply] = useState('');
  const [newDirectMessage, setNewDirectMessage] = useState('');
  const [showNewTriggerModal, setShowNewTriggerModal] = useState(false);
  const [previewName, setPreviewName] = useState('Mariana');

  const toggleWelcomeDm = () => {
    onUpdateAutomation({
      ...automation,
      welcomeDmEnabled: !automation.welcomeDmEnabled,
    });
  };

  const handleSaveTrigger = () => {
    if (!newKeyword.trim() || !newDirectMessage.trim()) return;

    const newTrigger: KeywordTrigger = {
      id: `kw_${Date.now()}`,
      keyword: newKeyword.trim().toUpperCase(),
      postDescription: newDescription.trim() || 'Qualquer publicação recente',
      commentReply: newCommentReply.trim() || 'Te enviei todos os detalhes no direct! 🚀',
      directMessage: newDirectMessage.trim(),
      active: true,
      triggerCount: 0,
    };

    onUpdateAutomation({
      ...automation,
      keywordTriggers: [...automation.keywordTriggers, newTrigger],
    });

    setNewKeyword('');
    setNewDescription('');
    setNewCommentReply('');
    setNewDirectMessage('');
    setShowNewTriggerModal(false);
  };

  const removeTrigger = (id: string) => {
    onUpdateAutomation({
      ...automation,
      keywordTriggers: automation.keywordTriggers.filter((t) => t.id !== id),
    });
  };

  const toggleTriggerActive = (id: string) => {
    onUpdateAutomation({
      ...automation,
      keywordTriggers: automation.keywordTriggers.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      ),
    });
  };

  const resolvedWelcomePreview = automation.welcomeDmMessage
    .replace(/\{primeiro_nome\}/gi, previewName)
    .replace(/\{username\}/gi, 'mariana.silva');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Automação de Direct Message e Funis de Venda</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Converta seguidores e comentários em conversas privadas imediatas no direct
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAiWithPrompt && (
            <button
              onClick={() => onOpenAiWithPrompt('welcome_dm')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Criar Copy com IA</span>
            </button>
          )}

          <button
            onClick={() => setShowNewTriggerModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Gatilho de Comentário</span>
          </button>
        </div>
      </div>

      {/* 1. DM de Boas-Vindas */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">DM de Boas-Vindas para Novos Seguidores</h3>
              <p className="text-xs text-neutral-400">
                Envia automaticamente uma mensagem acolhedora minutos após alguém te seguir
              </p>
            </div>
          </div>

          <button
            onClick={toggleWelcomeDm}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              automation.welcomeDmEnabled ? 'bg-rose-600' : 'bg-neutral-800'
            }`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                automation.welcomeDmEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-neutral-800/80">
          <div className="space-y-2">
            <label className="text-xs text-neutral-300 font-medium block">
              Mensagem de Boas-Vindas (Suporta tags dinâmicas):
            </label>
            <textarea
              rows={4}
              value={automation.welcomeDmMessage}
              onChange={(e) =>
                onUpdateAutomation({ ...automation, welcomeDmMessage: e.target.value })
              }
              className="w-full rounded border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-neutral-700 focus:outline-none"
            />
            <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
              <span>Tags disponíveis:</span>
              <span className="text-neutral-300">{"{primeiro_nome}"}</span>
              <span className="text-neutral-300">{"{username}"}</span>
            </div>
          </div>

          {/* Visual Smartphone Bubble Mockup */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="text-neutral-300 font-semibold">Prévia no Direct do Seguidor</span>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> Delay de 3 min
                </span>
              </div>
              <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-rose-900/60 to-purple-900/60 border border-neutral-800 p-3 text-xs text-white max-w-sm ml-auto shadow-sm">
                <p>{resolvedWelcomePreview}</p>
                <span className="block text-[10px] text-neutral-400 text-right mt-1 font-mono">11:28 · Enviado</span>
              </div>
            </div>
            <div className="text-[11px] text-neutral-500 mt-2">
              Humanização ativada: envios espaçados para evitar spam e bloqueio no direct.
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gatilhos de Comentário ("Comente QUERO e receba o link no direct") */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Gatilhos de Palavra-Chave (Comentário ➔ Direct)</h3>
              <p className="text-xs text-neutral-400">
                Ex: Quando alguém comentar "QUERO", responde o comentário e envia o link no direct
              </p>
            </div>
          </div>
        </div>

        {/* Triggers list */}
        <div className="space-y-3 pt-2">
          {automation.keywordTriggers.map((trig) => (
            <div
              key={trig.id}
              className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Palavra: "{trig.keyword}"
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {trig.postDescription}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 font-mono tabular-nums">
                    {trig.triggerCount} disparos
                  </span>
                  <button
                    onClick={() => toggleTriggerActive(trig.id)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      trig.active ? 'bg-emerald-600' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                        trig.active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => removeTrigger(trig.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                    title="Excluir gatilho"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-neutral-850">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold mb-0.5">
                    1. Resposta Pública no Comentário do Post:
                  </span>
                  <p className="text-neutral-300 italic">"{trig.commentReply}"</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold mb-0.5">
                    2. Mensagem Enviada no Direct:
                  </span>
                  <p className="text-neutral-200">{trig.directMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Trigger */}
      {showNewTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Cadastrar Novo Gatilho Automático
              </h3>
              <button
                onClick={() => setShowNewTriggerModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Palavra-Chave Disparadora (o que a pessoa comenta no post):
                </label>
                <input
                  type="text"
                  placeholder="Ex: QUERO, LINK, PRECO, AULA"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Descrição ou Post Vinculado:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Reels sobre Guia de Marketing"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Resposta Pública ao Comentário:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Te enviei no direct agora mesmo! 🚀"
                  value={newCommentReply}
                  onChange={(e) => setNewCommentReply(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Mensagem Privada do Direct (com link):
                </label>
                <textarea
                  rows={3}
                  placeholder="Olá {primeiro_nome}! Aqui está o seu link de acesso exclusivo: https://seu-link.com"
                  value={newDirectMessage}
                  onChange={(e) => setNewDirectMessage(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowNewTriggerModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTrigger}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
              >
                Salvar Gatilho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
