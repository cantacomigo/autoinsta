import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  UserMinus, 
  Eye, 
  Smile, 
  Sparkles, 
  Play, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  HelpCircle,
  Shuffle
} from 'lucide-react';
import { AutomationConfig } from '../types';
import { parseSpintax, generateSpintaxPreviews } from '../utils/spintax';

interface EngagementViewProps {
  automation: AutomationConfig;
  onUpdateAutomation: (newAutomation: AutomationConfig) => void;
  onOpenAiWithPrompt?: (type: string) => void;
}

export const EngagementView: React.FC<EngagementViewProps> = ({
  automation,
  onUpdateAutomation,
  onOpenAiWithPrompt,
}) => {
  const [newSpintaxComment, setNewSpintaxComment] = useState('');
  const [newWhitelistUser, setNewWhitelistUser] = useState('');
  const [testPreviews, setTestPreviews] = useState<string[]>([]);
  const [testingTemplateIndex, setTestingTemplateIndex] = useState<number | null>(null);

  const toggleConfig = (key: keyof AutomationConfig) => {
    onUpdateAutomation({
      ...automation,
      [key]: !automation[key],
    });
  };

  const addSpintaxComment = () => {
    if (!newSpintaxComment.trim()) return;
    onUpdateAutomation({
      ...automation,
      commentsSpintax: [...automation.commentsSpintax, newSpintaxComment.trim()],
    });
    setNewSpintaxComment('');
  };

  const removeSpintaxComment = (index: number) => {
    onUpdateAutomation({
      ...automation,
      commentsSpintax: automation.commentsSpintax.filter((_, i) => i !== index),
    });
  };

  const addWhitelist = () => {
    if (!newWhitelistUser.trim()) return;
    let user = newWhitelistUser.trim();
    if (!user.startsWith('@')) user = `@${user}`;
    if (!automation.whitelist.includes(user)) {
      onUpdateAutomation({
        ...automation,
        whitelist: [...automation.whitelist, user],
      });
    }
    setNewWhitelistUser('');
  };

  const removeWhitelist = (userToRemove: string) => {
    onUpdateAutomation({
      ...automation,
      whitelist: automation.whitelist.filter((u) => u !== userToRemove),
    });
  };

  const runSpintaxTest = (template: string, index: number) => {
    setTestingTemplateIndex(index);
    const variations = generateSpintaxPreviews(template, 3, {
      username: 'carolina.designer',
    });
    setTestPreviews(variations);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Configurações de Ações e Engajamento Automático</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Ative ou personalize como o AutoInsta irá curtir, comentar, seguir e interagir com stories
          </p>
        </div>

        {onOpenAiWithPrompt && (
          <button
            onClick={() => onOpenAiWithPrompt('spintax_comments')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors self-start"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerar Comentários com IA</span>
          </button>
        )}
      </div>

      {/* Grid: 4 Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Curtidas em Publicações */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Curtir Publicações Recentes</h3>
                <p className="text-xs text-neutral-400">Curte fotos no feed de alvos e hashtags</p>
              </div>
            </div>

            <button
              onClick={() => toggleConfig('likePosts')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                automation.likePosts ? 'bg-rose-600' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  automation.likePosts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-800/80">
            <label className="text-xs text-neutral-300 block font-medium mb-1.5">
              Quantas fotos curtir por perfil encontrado:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => onUpdateAutomation({ ...automation, likesPerProfile: count })}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    automation.likesPerProfile === count
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {count} {count === 1 ? 'Foto' : 'Fotos'}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-neutral-500 mt-2 block">
              Recomendado: 2 fotos. Aumenta a notificação no celular do usuário sem parecer robô.
            </span>
          </div>
        </div>

        {/* 2. Visualização & Reações em Stories */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Visualização em Massa de Stories</h3>
                <p className="text-xs text-neutral-400">Stories Mass Viewer com curtidas e votos</p>
              </div>
            </div>

            <button
              onClick={() => toggleConfig('viewStories')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                automation.viewStories ? 'bg-amber-600' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  automation.viewStories ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 space-y-2">
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={automation.likeStories}
                onChange={() => toggleConfig('likeStories')}
                className="rounded border-neutral-700 bg-neutral-950 text-amber-600 focus:ring-0"
              />
              <span>Curtir o último Story visualizado (Aumenta o destaque)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={automation.reactPolls}
                onChange={() => toggleConfig('reactPolls')}
                className="rounded border-neutral-700 bg-neutral-950 text-amber-600 focus:ring-0"
              />
              <span>Votar em Enquetes e responder caixas com reações de emoji</span>
            </label>
          </div>
        </div>

        {/* 3. Seguir e Deixar de Seguir (Follow & Unfollow) */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Seguir & Unfollow Inteligente</h3>
                <p className="text-xs text-neutral-400">Follow-back orgânico com limpeza de perfil</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={automation.followUsers}
                  onChange={() => toggleConfig('followUsers')}
                  className="rounded border-neutral-700 bg-neutral-950 text-emerald-600 focus:ring-0"
                />
                <span>Seguir</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={automation.unfollowUsers}
                  onChange={() => toggleConfig('unfollowUsers')}
                  className="rounded border-neutral-700 bg-neutral-950 text-emerald-600 focus:ring-0"
                />
                <span>Unfollow</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Tempo de espera antes do unfollow:</span>
              <span className="font-mono text-white font-semibold">
                {automation.unfollowAfterDays} dias
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={14}
              value={automation.unfollowAfterDays}
              onChange={(e) =>
                onUpdateAutomation({
                  ...automation,
                  unfollowAfterDays: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />

            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={automation.unfollowOnlyNonFollowers}
                onChange={() => toggleConfig('unfollowOnlyNonFollowers')}
                className="rounded border-neutral-700 bg-neutral-950 text-emerald-600 focus:ring-0"
              />
              <span>Não deixar de seguir quem já te segue de volta</span>
            </label>

            {/* Whitelist Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-neutral-300 font-medium">
                  Whitelist / Lista Segura ({automation.whitelist.length})
                </span>
                <span className="text-[11px] text-neutral-500">Nunca serão unfollowed</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="@amigo_ou_parceiro"
                  value={newWhitelistUser}
                  onChange={(e) => setNewWhitelistUser(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addWhitelist()}
                  className="flex-1 rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-xs text-white placeholder-neutral-500"
                />
                <button
                  onClick={addWhitelist}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {automation.whitelist.map((user) => (
                  <span
                    key={user}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[11px] text-neutral-200"
                  >
                    <span>{user}</span>
                    <button
                      onClick={() => removeWhitelist(user)}
                      className="text-neutral-400 hover:text-rose-400"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Comentários Automáticos Spintax */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Comentários com Spintax</h3>
                <p className="text-xs text-neutral-400">Gera milhares de variações humanizadas</p>
              </div>
            </div>

            <button
              onClick={() => toggleConfig('commentPosts')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                automation.commentPosts ? 'bg-purple-600' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  automation.commentPosts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Sintaxe Spintax: <code className="text-purple-300">{"{Opção 1|Opção 2}"}</code></span>
              <span>Variável: <code className="text-neutral-300">{"@{username}"}</code></span>
            </div>

            {/* Input to add new template */}
            <div className="space-y-1.5">
              <textarea
                rows={2}
                placeholder="{Incrível|Sensacional|Muito bom} esse post, @{username}! {Parabéns|Muito top} 🚀"
                value={newSpintaxComment}
                onChange={(e) => setNewSpintaxComment(e.target.value)}
                className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none font-mono"
              />
              <button
                onClick={addSpintaxComment}
                className="w-full py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Salvar Novo Modelo Spintax
              </button>
            </div>

            {/* List of current templates */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {automation.commentsSpintax.map((tpl, idx) => (
                <div
                  key={idx}
                  className="rounded border border-neutral-800 bg-neutral-950/80 p-2.5 text-xs text-neutral-300"
                >
                  <p className="font-mono text-[11px] mb-2 text-neutral-200">{tpl}</p>
                  <div className="flex items-center justify-between border-t border-neutral-850 pt-1.5">
                    <button
                      onClick={() => runSpintaxTest(tpl, idx)}
                      className="text-purple-400 hover:text-purple-300 text-[11px] flex items-center gap-1 font-medium"
                    >
                      <Shuffle className="w-3 h-3" />
                      Testar Variações
                    </button>
                    <button
                      onClick={() => removeSpintaxComment(idx)}
                      className="text-neutral-500 hover:text-rose-400 text-[11px] transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Previews Output */}
            {testPreviews.length > 0 && (
              <div className="rounded border border-purple-900/50 bg-purple-950/20 p-2.5 text-xs">
                <span className="text-purple-300 font-semibold block mb-1">
                  Exemplos gerados aleatoriamente:
                </span>
                <ul className="space-y-1 text-neutral-300 text-[11px]">
                  {testPreviews.map((p, i) => (
                    <li key={i} className="bg-neutral-900/80 p-1.5 rounded border border-neutral-800">
                      "{p}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
