import React, { useState } from 'react';
import { 
  Hash, 
  Users, 
  MapPin, 
  Compass, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Info 
} from 'lucide-react';
import { TargetingConfig } from '../types';

interface TargetingViewProps {
  targeting: TargetingConfig;
  onUpdateTargeting: (newTargeting: TargetingConfig) => void;
  onOpenAiWithPrompt?: (promptType: string) => void;
}

export const TargetingView: React.FC<TargetingViewProps> = ({
  targeting,
  onUpdateTargeting,
  onOpenAiWithPrompt,
}) => {
  const [newHashtag, setNewHashtag] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(false);

  const addHashtag = () => {
    if (!newHashtag.trim()) return;
    let tag = newHashtag.trim();
    if (!tag.startsWith('#')) tag = `#${tag}`;
    if (!targeting.hashtags.includes(tag)) {
      onUpdateTargeting({
        ...targeting,
        hashtags: [...targeting.hashtags, tag],
      });
    }
    setNewHashtag('');
  };

  const removeHashtag = (tagToRemove: string) => {
    onUpdateTargeting({
      ...targeting,
      hashtags: targeting.hashtags.filter((t) => t !== tagToRemove),
    });
  };

  const addCompetitor = () => {
    if (!newCompetitor.trim()) return;
    let comp = newCompetitor.trim();
    if (!comp.startsWith('@')) comp = `@${comp}`;
    if (!targeting.competitorAccounts.includes(comp)) {
      onUpdateTargeting({
        ...targeting,
        competitorAccounts: [...targeting.competitorAccounts, comp],
      });
    }
    setNewCompetitor('');
  };

  const removeCompetitor = (compToRemove: string) => {
    onUpdateTargeting({
      ...targeting,
      competitorAccounts: targeting.competitorAccounts.filter((c) => c !== compToRemove),
    });
  };

  const addLocation = () => {
    if (!newLocation.trim()) return;
    const loc = newLocation.trim();
    if (!targeting.locations.includes(loc)) {
      onUpdateTargeting({
        ...targeting,
        locations: [...targeting.locations, loc],
      });
    }
    setNewLocation('');
  };

  const removeLocation = (locToRemove: string) => {
    onUpdateTargeting({
      ...targeting,
      locations: targeting.locations.filter((l) => l !== locToRemove),
    });
  };

  const addPostUrl = () => {
    if (!newPostUrl.trim()) return;
    const url = newPostUrl.trim();
    if (!targeting.postCommenters.includes(url)) {
      onUpdateTargeting({
        ...targeting,
        postCommenters: [...targeting.postCommenters, url],
      });
    }
    setNewPostUrl('');
  };

  const removePostUrl = (urlToRemove: string) => {
    onUpdateTargeting({
      ...targeting,
      postCommenters: targeting.postCommenters.filter((u) => u !== urlToRemove),
    });
  };

  const updateFilters = (key: keyof TargetingConfig['filters'], value: any) => {
    onUpdateTargeting({
      ...targeting,
      filters: {
        ...targeting.filters,
        [key]: value,
      },
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Segmentação de Público e Fontes de Interação</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Defina exatamente onde o robô irá encontrar pessoas interessadas no seu nicho
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveFeedback && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Salvo
            </span>
          )}
          {onOpenAiWithPrompt && (
            <button
              onClick={() => onOpenAiWithPrompt('targeting')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sugerir Alvos com IA</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Banner: Instagram anti-scraping notice & best practices */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs space-y-2">
        <div className="flex items-center gap-2 font-semibold text-amber-300 text-sm">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>O Instagram não está exibindo os seguidores na Web? Entenda o motivo:</span>
        </div>
        <p className="leading-relaxed text-neutral-300">
          A Meta/Instagram adicionou uma restrição anti-raspagem (anti-scraping) na versão Web para perfis grandes ou comerciais. Ao clicar em <em>"Seguidores"</em>, a janela abre vazia com o aviso <em>"Você verá todas as pessoas que seguem você aqui"</em> para impedir extração em massa.
        </p>
        <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-neutral-200">
          <span className="font-semibold text-amber-300">🚀 Alternativas com resultado 5x maior:</span>
          <span className="text-neutral-300">
            • <strong>Curtidores e Comentadores dos posts recentes</strong> (perfis 100% ativos hoje).
          </span>
          <span className="text-neutral-300">
            • <strong>Localização e Hashtags da cidade</strong> (alcança moradores reais).
          </span>
        </div>
      </div>

      {/* Grid: Fontes de Alvo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Hashtags */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-rose-400" />
                Hashtags Segmentadas
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono tabular-nums">
                  {targeting.hashtags.length} ativas
                </span>
                {targeting.hashtags.length > 0 && (
                  <button
                    onClick={() => onUpdateTargeting({ ...targeting, hashtags: [] })}
                    className="text-[10px] text-neutral-500 hover:text-rose-400 underline cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              O robô interage com as publicações mais recentes postadas nestas hashtags.
            </p>

            {/* Input to add */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="#marketingdigital"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
                className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
              />
              <button
                onClick={addHashtag}
                className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>

            {/* Tags list */}
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {targeting.hashtags.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-2">Nenhuma hashtag cadastrada. Adicione hashtags do seu nicho acima.</p>
              ) : (
                targeting.hashtags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-200"
                  >
                    <span className="font-mono">{tag}</span>
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="text-neutral-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 2. Perfis Concorrentes / Referências */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Seguidores de Concorrentes
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono tabular-nums">
                  {targeting.competitorAccounts.length} perfis
                </span>
                {targeting.competitorAccounts.length > 0 && (
                  <button
                    onClick={() => onUpdateTargeting({ ...targeting, competitorAccounts: [] })}
                    className="text-[10px] text-neutral-500 hover:text-rose-400 underline cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Alcança os seguidores mais ativos e engajados das contas que são suas referências.
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="@concorrente_oficial"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
              />
              <button
                onClick={addCompetitor}
                className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {targeting.competitorAccounts.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-2">Nenhum concorrente cadastrado. Adicione perfis de referência acima.</p>
              ) : (
                targeting.competitorAccounts.map((comp) => (
                  <div
                    key={comp}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-200"
                  >
                    <span className="font-semibold">{comp}</span>
                    <button
                      onClick={() => removeCompetitor(comp)}
                      className="text-neutral-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. Localizações Geográficas */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Localizações & Check-ins
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono tabular-nums">
                  {targeting.locations.length} locais
                </span>
                {targeting.locations.length > 0 && (
                  <button
                    onClick={() => onUpdateTargeting({ ...targeting, locations: [] })}
                    className="text-[10px] text-neutral-500 hover:text-rose-400 underline cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Interage com publicações marcadas em cidades, bairros ou locais específicos.
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="São Paulo, Brazil"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
              />
              <button
                onClick={addLocation}
                className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {targeting.locations.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-2">Nenhuma localização cadastrada. Adicione sua cidade ou pontos de interesse.</p>
              ) : (
                targeting.locations.map((loc) => (
                  <div
                    key={loc}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-200"
                  >
                    <span>{loc}</span>
                    <button
                      onClick={() => removeLocation(loc)}
                      className="text-neutral-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 4. Comentadores de Publicações Específicas & Explorar */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Comentadores de Posts / Explorar
              </span>
              <div className="flex items-center gap-3">
                {targeting.postCommenters.length > 0 && (
                  <button
                    onClick={() => onUpdateTargeting({ ...targeting, postCommenters: [] })}
                    className="text-[10px] text-neutral-500 hover:text-rose-400 underline cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={targeting.exploreFeed}
                    onChange={(e) =>
                      onUpdateTargeting({ ...targeting, exploreFeed: e.target.checked })
                    }
                    className="rounded border-neutral-700 bg-neutral-950 text-rose-600 focus:ring-0"
                  />
                  <span>Feed Explorar</span>
                </label>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Extrai e engaja com os usuários que comentaram em posts virais do seu nicho.
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="https://instagram.com/p/C9vKmQ0xLop/"
                value={newPostUrl}
                onChange={(e) => setNewPostUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPostUrl()}
                className="flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none truncate"
              />
              <button
                onClick={addPostUrl}
                className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Vincular
              </button>
            </div>

            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {targeting.postCommenters.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-2">Nenhum post vinculado. Cole o link de um post com comentários acima.</p>
              ) : (
                targeting.postCommenters.map((url) => (
                  <div
                    key={url}
                    className="flex items-center justify-between px-2.5 py-1 rounded bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-200"
                  >
                    <span className="font-mono truncate max-w-[280px]">{url}</span>
                    <button
                      onClick={() => removePostUrl(url)}
                      className="text-neutral-400 hover:text-rose-400 transition-colors shrink-0 ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Rigorosos Anti-Bot & Anti-Spam */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Filtros Avançados Anti-Spam e Qualificação de Perfis
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Evita interagir com contas falsas, bots ou perfis desativados para proteger a reputação da sua conta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          
          {/* Mínimo e Máximo de Seguidores */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 space-y-2">
            <label className="text-xs text-neutral-300 font-medium block">
              Faixa de Seguidores do Perfil
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-neutral-500 block">MÍNIMO</span>
                <input
                  type="number"
                  value={targeting.filters.minFollowers}
                  onChange={(e) => updateFilters('minFollowers', parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">MÁXIMO</span>
                <input
                  type="number"
                  value={targeting.filters.maxFollowers}
                  onChange={(e) => updateFilters('maxFollowers', parseInt(e.target.value, 10) || 100000)}
                  className="w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-white font-mono"
                />
              </div>
            </div>
            <span className="text-[11px] text-neutral-400 block">
              Descarte influenciadores gigantes ou bots sem público.
            </span>
          </div>

          {/* Mínimo de Posts */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 space-y-2">
            <label className="text-xs text-neutral-300 font-medium block">
              Mínimo de Posts Publicados
            </label>
            <input
              type="number"
              value={targeting.filters.minPosts}
              onChange={(e) => updateFilters('minPosts', parseInt(e.target.value, 10) || 0)}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-white font-mono"
            />
            <span className="text-[11px] text-neutral-400 block">
              Exige que o perfil tenha ao menos {targeting.filters.minPosts} fotos no feed.
            </span>
          </div>

          {/* Tipo de Perfil */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 space-y-2">
            <label className="text-xs text-neutral-300 font-medium block">
              Tipo de Conta
            </label>
            <select
              value={targeting.filters.accountType}
              onChange={(e) => updateFilters('accountType', e.target.value)}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-white"
            >
              <option value="all">Todas as Contas</option>
              <option value="personal">Apenas Perfis Pessoais</option>
              <option value="business">Apenas Contas Comerciais / Criadores</option>
            </select>
            <span className="text-[11px] text-neutral-400 block">
              Foque em clientes finais ou parcerias B2B.
            </span>
          </div>

          {/* Checkboxes de Validação */}
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2 p-2.5 rounded border border-neutral-800 bg-neutral-950/60 text-xs text-neutral-300 cursor-pointer hover:bg-neutral-850 transition-colors">
              <input
                type="checkbox"
                checked={targeting.filters.hasProfilePic}
                onChange={(e) => updateFilters('hasProfilePic', e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-900 text-rose-600 focus:ring-0"
              />
              <span>Foto de Perfil Obrigatória</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded border border-neutral-800 bg-neutral-950/60 text-xs text-neutral-300 cursor-pointer hover:bg-neutral-850 transition-colors">
              <input
                type="checkbox"
                checked={targeting.filters.hasBio}
                onChange={(e) => updateFilters('hasBio', e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-900 text-rose-600 focus:ring-0"
              />
              <span>Biografia Preenchida Obrigatória</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded border border-neutral-800 bg-neutral-950/60 text-xs text-neutral-300 cursor-pointer hover:bg-neutral-850 transition-colors">
              <input
                type="checkbox"
                checked={targeting.filters.skipPrivate}
                onChange={(e) => updateFilters('skipPrivate', e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-900 text-rose-600 focus:ring-0"
              />
              <span>Pular Perfis Privados (Trancados)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
