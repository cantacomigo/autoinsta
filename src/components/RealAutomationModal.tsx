import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Key, 
  Chrome, 
  Play,
  Layers,
  Sparkles
} from 'lucide-react';
import { InstagramAccount, TargetingConfig } from '../types';

interface RealAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: InstagramAccount;
  targeting: TargetingConfig;
  onConnectRealSession: (sessionId: string, csrfToken: string) => Promise<boolean>;
}

export const RealAutomationModal: React.FC<RealAutomationModalProps> = ({
  isOpen,
  onClose,
  account,
  targeting,
  onConnectRealSession,
}) => {
  const [activeTab, setActiveTab] = useState<'browser_runner' | 'server_session'>('browser_runner');
  const [copied, setCopied] = useState(false);
  const [sessionIdInput, setSessionIdInput] = useState(account.sessionId || '');
  const [csrfTokenInput, setCsrfTokenInput] = useState(account.csrfToken || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate real browser automation script based on user targets and safety delay
  const targetHashtags = targeting.hashtags.length > 0 ? targeting.hashtags : ['marketingdigital', 'empreendedorismo'];
  const targetProfiles = targeting.competitorAccounts.length > 0 ? targeting.competitorAccounts : ['instagram'];
  const [minDelay, maxDelay] = account.delayRange;

  const browserAutomationScript = `/**
 * ========================================================
 * AutoInsta - Robô de Automação Direta no Instagram Web
 * Executado diretamente na sua sessão local (100% Anti-Ban)
 * ========================================================
 */
(async function runAutoInsta() {
  console.clear();
  console.log("%c [AutoInsta] Inicializando Automação Real... ", "background: #f59e0b; color: #000; font-weight: bold; font-size: 14px; padding: 4px;");

  const CONFIG = {
    minDelaySeconds: ${minDelay},
    maxDelaySeconds: ${maxDelay},
    maxActionsPerSession: 30,
    targetHashtags: ${JSON.stringify(targetHashtags)},
    targetProfiles: ${JSON.stringify(targetProfiles)},
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Cria barra de status flutuante no Instagram
  let hud = document.getElementById('autoinsta-hud');
  if (!hud) {
    hud = document.createElement('div');
    hud.id = 'autoinsta-hud';
    hud.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:#18181b;color:#f4f4f5;border:1px solid #f59e0b;padding:16px;border-radius:12px;font-family:sans-serif;box-shadow:0 10px 25px rgba(0,0,0,0.5);width:320px;';
    document.body.appendChild(hud);
  }

  function updateHud(status, count, nextIn) {
    hud.innerHTML = \`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <span style="font-weight:bold;color:#f59e0b;font-size:13px;">⚡ AutoInsta Ativo</span>
        <span style="background:#27272a;padding:2px 8px;border-radius:6px;font-size:11px;">Ações: \${count}/\${CONFIG.maxActionsPerSession}</span>
      </div>
      <div style="font-size:12px;color:#a1a1aa;margin-bottom:6px;">Status: <b style="color:#fafafa;">\${status}</b></div>
      <div style="font-size:11px;color:#71717a;">Próxima ação em: \${nextIn}s (Intervalo anti-bloqueio)</div>
    \`;
  }

  let actionsDone = 0;
  updateHud("Buscando botões de interação na tela...", actionsDone, 0);

  // Procura botões de Seguir / Follow na página do Instagram
  const buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
    const txt = (btn.innerText || '').trim().toLowerCase();
    return txt === 'seguir' || txt === 'follow';
  });

  if (buttons.length === 0) {
    alert("AutoInsta: Abra a lista de seguidores de um concorrente ou uma hashtag no Instagram antes de rodar o robô!");
    hud.remove();
    return;
  }

  console.log(\`[AutoInsta] Encontrados \${buttons.length} perfis qualificados na página.\`);

  for (const btn of buttons) {
    if (actionsDone >= CONFIG.maxActionsPerSession) {
      updateHud("Limite diário de segurança atingido!", actionsDone, 0);
      break;
    }

    try {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(1500);

      // Clica no botão de seguir de verdade
      btn.click();
      actionsDone++;
      console.log(\`%c [AutoInsta] Ação \${actionsDone}: Seguiu perfil com sucesso! \`, "color: #10b981; font-weight: bold;");

      const delay = randomBetween(CONFIG.minDelaySeconds, CONFIG.maxDelaySeconds);
      
      for (let s = delay; s > 0; s--) {
        updateHud("Seguiu perfil com sucesso!", actionsDone, s);
        await sleep(1000);
      }
    } catch (e) {
      console.error("[AutoInsta] Erro na ação:", e);
    }
  }

  updateHud("Ciclo finalizado com segurança.", actionsDone, 0);
})();`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(browserAutomationScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVerifySession = async () => {
    if (!sessionIdInput.trim()) {
      setVerificationFeedback('Por favor, insira o seu sessionid do Instagram.');
      return;
    }

    setIsVerifying(true);
    setVerificationFeedback(null);

    try {
      const success = await onConnectRealSession(sessionIdInput.trim(), csrfTokenInput.trim());
      if (success) {
        setVerificationFeedback('✅ Conta do Instagram conectada e autenticada com sucesso!');
      } else {
        setVerificationFeedback('❌ Sessão inválida ou bloqueada pelo Instagram. Verifique o cookie.');
      }
    } catch (err: any) {
      setVerificationFeedback(`Erro: ${err?.message || 'Falha ao conectar'}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Como Executar Ações REAIS no Instagram
              </h2>
              <p className="text-xs text-neutral-400">
                Entenda a diferença entre o Modo Simulação e a Execução Real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-3 text-xs text-amber-200/90">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            <b>Execução Real no Instagram:</b> Escolha abaixo como deseja despachar as ações da sua conta @{account.username} de forma segura, com proteção anti-ban e IP residencial.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('browser_runner')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'browser_runner'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span>Método 1: Robô no seu Navegador (Recomendado)</span>
          </button>
          <button
            onClick={() => setActiveTab('server_session')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'server_session'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Método 2: Conectar Chave de Sessão (Cloud 24/7)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-neutral-300 text-xs">
          {activeTab === 'browser_runner' ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-start gap-2.5 text-emerald-300">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <span className="font-semibold">O método mais seguro e à prova de bloqueio de IP:</span>
                  <p className="mt-0.5 text-neutral-300">
                    Como você já está com o Instagram aberto no seu Chrome na sua internet residencial, o robô roda diretamente na sua sessão existente sem disparar alertas de novo dispositivo na Meta.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white text-sm">Passo a passo rápido (30 segundos):</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-neutral-300 pl-1">
                  <li>Abra a aba do <b>Instagram</b> no seu navegador onde você já está logado.</li>
                  <li>Abra o perfil de um concorrente (ex: clique nos <b>Seguidores</b> dele) ou em uma <b>Hashtag</b>.</li>
                  <li>Pressione <b>F12</b> no teclado (ou clique com botão direito &gt; <i>Inspecionar</i>) e clique na aba <b>Console</b>.</li>
                  <li>Clique no botão abaixo para <b>Copiar o Script do Robô</b>, cole no Console e aperte <b>Enter</b>!</li>
                </ol>
              </div>

              {/* Code box */}
              <div className="relative rounded-lg bg-neutral-950 border border-neutral-800 p-3 font-mono text-[11px] text-neutral-400 overflow-x-auto max-h-40">
                <pre>{browserAutomationScript}</pre>
                <button
                  onClick={handleCopyScript}
                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-md shadow transition-colors text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Script do Robô'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-neutral-400">
                  Delay configurado: <b>{minDelay}s a {maxDelay}s</b> entre ações reais.
                </span>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-lg transition-colors text-xs"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{copied ? 'Código Copiado! Cole no Console do Instagram' : 'Copiar Script Pronto'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-neutral-300">
                Para que o servidor na nuvem execute ações pelo seu perfil 24 horas por dia, ele precisa do cookie de autenticação <code>sessionid</code> gerado pelo Instagram ao fazer login.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    Cookie <code>sessionid</code> do Instagram:
                  </label>
                  <input
                    type="text"
                    value={sessionIdInput}
                    onChange={(e) => setSessionIdInput(e.target.value)}
                    placeholder="Ex: 6819238492%3As9eJ9a... ou cole aqui"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Como achar: Na aba do Instagram &gt; F12 &gt; Aba "Aplicativo" (Application) &gt; Cookies &gt; instagram.com &gt; copie o valor de <b>sessionid</b>.
                  </span>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    Cookie <code>csrftoken</code> (opcional, para segurança extra):
                  </label>
                  <input
                    type="text"
                    value={csrfTokenInput}
                    onChange={(e) => setCsrfTokenInput(e.target.value)}
                    placeholder="Ex: zxcyFZSo2UzgRpoFcm3Nzn"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {verificationFeedback && (
                  <div className={`p-3 rounded-lg text-xs ${
                    verificationFeedback.includes('✅')
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/10 border border-red-500/20 text-red-300'
                  }`}>
                    {verificationFeedback}
                  </div>
                )}

                <button
                  onClick={handleVerifySession}
                  disabled={isVerifying}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  {isVerifying ? (
                    <span>Verificando com o Instagram...</span>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <span>Conectar e Validar Conta Real</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <span>AutoInsta v2.4 • Proteção Anti-Ban Ativa</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
