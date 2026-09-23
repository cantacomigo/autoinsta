import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Wand2, 
  Layers, 
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
  accountNiche?: string;
  onApplySpintax?: (spintaxText: string) => void;
  onApplyWelcomeDm?: (dmText: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'spintax_comments',
  accountNiche = 'Saúde e Bem-Estar',
  onApplySpintax,
  onApplyWelcomeDm,
}) => {
  const [activeType, setActiveType] = useState<string>(defaultType);
  const [niche, setNiche] = useState<string>(accountNiche);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    setApplied(false);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeType,
          niche: niche || accountNiche,
          prompt: customGoal,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setGeneratedResult(data.text);
      } else {
        setGeneratedResult('Não foi possível gerar no momento. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      if (activeType === 'spintax_comments') {
        setGeneratedResult(
          `{Sensacional|Excelente|Muito bom|Incrível} esse {conteúdo|post}, @{username}! {Parabéns pelo trabalho|Sempre agregando muito valor}! 👏🔥`
        );
      } else {
        setGeneratedResult(
          `Olá {primeiro_nome}! Seja muito bem-vindo(a) ao meu perfil 👋 Preparei um conteúdo exclusivo para você. Me conta: qual o seu foco hoje em ${niche}?`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (activeType === 'spintax_comments' && onApplySpintax) {
      onApplySpintax(generatedResult);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    } else if (activeType === 'welcome_dm' && onApplyWelcomeDm) {
      onApplyWelcomeDm(generatedResult);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Assistente de Copy & IA AutoInsta</h3>
              <p className="text-[11px] text-neutral-400">Desenvolvido com Google Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-lg p-1"
          >
            &times;
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
          {[
            { id: 'spintax_comments', label: 'Spintax Comentários' },
            { id: 'welcome_dm', label: 'DM Boas-Vindas' },
            { id: 'keyword_dm', label: 'DM Gatilho de Venda' },
            { id: 'targeting', label: 'Estratégia de Alvos' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveType(t.id);
                setGeneratedResult('');
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                activeType === t.id
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-neutral-300 font-medium block mb-1">
              Nicho ou Assunto do Perfil:
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Nutrição Esportiva, Moda Feminina, Imobiliária, Marketing"
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-medium block mb-1">
              Instrução Específica (Opcional):
            </label>
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="Ex: Tom descontraído com gancho para pedir o WhatsApp"
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2 rounded bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gerando com Inteligência Artificial...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Gerar Sugestão Otimizada</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Output */}
        {generatedResult && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="font-semibold text-neutral-300">Resultado Gerado:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                {(activeType === 'spintax_comments' || activeType === 'welcome_dm') && (
                  <button
                    onClick={handleApply}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <ArrowRight className="w-3 h-3" />
                    <span>{applied ? 'Aplicado!' : 'Aplicar na Configuração'}</span>
                  </button>
                )}
              </div>
            </div>

            <p className="font-mono text-neutral-200 text-xs bg-neutral-900/90 p-2.5 rounded border border-neutral-850 leading-relaxed whitespace-pre-wrap">
              {generatedResult}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
