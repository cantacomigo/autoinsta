import React, { useEffect, useState, useRef } from 'react';
import { 
  Globe, 
  Terminal, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  Play, 
  Pause, 
  ExternalLink,
  Heart,
  MessageCircle,
  UserPlus,
  Send
} from 'lucide-react';
import { InstagramAccount, ProxyConfig, ActivityLog } from '../types';

interface LiveSimulatorProps {
  account: InstagramAccount;
  proxy?: ProxyConfig;
  isRunning: boolean;
  onToggleRunning: () => void;
  onExecuteManualAction: () => void;
  logs: ActivityLog[];
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  account,
  proxy,
  isRunning,
  onToggleRunning,
  onExecuteManualAction,
  logs,
}) => {
  const [countdown, setCountdown] = useState<number>(34);
  const [currentStepText, setCurrentStepText] = useState<string>(
    isRunning ? 'Aguardando intervalo humano de proteção anti-ban...' : 'Automação pausada. Clique em Iniciar para ativar o robô.'
  );
  const [simulatedUrl, setSimulatedUrl] = useState<string>('https://instagram.com/explore/tags/vidasaudavel/');

  const actionRef = useRef(onExecuteManualAction);
  useEffect(() => {
    actionRef.current = onExecuteManualAction;
  });

  useEffect(() => {
    if (!isRunning) {
      setCurrentStepText('Automação pausada');
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTimeout(() => {
            actionRef.current();
            setCurrentStepText('Interagindo com publicação do público-alvo no feed...');
          }, 50);

          const [minD, maxD] = account.delayRange;
          return Math.floor(Math.random() * (maxD - minD + 1)) + minD;
        }
        if (prev === 15) {
          setCurrentStepText('Rolando a página do feed e analisando engajamento do perfil...');
        } else if (prev === 5) {
          setCurrentStepText('Preparando ação de curtida e verificação de perfil anti-bot...');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, account.delayRange]);

  const latestLog = logs[0];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 overflow-hidden shadow-xl">
      {/* Header bar styled like a browser / console top */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-950 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="flex items-center gap-2 rounded bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 font-mono">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span className="max-w-[240px] truncate sm:max-w-md">{simulatedUrl}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Emulação Ativa</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-neutral-500"></span>
              <span>Emulador Pausado</span>
            </div>
          )}

          <button
            onClick={onExecuteManualAction}
            disabled={!isRunning}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
            title="Forçar execução da próxima ação agora"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Executar Agora</span>
          </button>
        </div>
      </div>

      {/* Main browser preview area */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Mockup & Active Step */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-rose-400" />
                Ação em Execução no Instagram
              </span>
              <span className="font-mono tabular-nums text-neutral-400">
                {isRunning ? `Próxima ação em ${countdown}s` : 'Parado'}
              </span>
            </div>

            {/* Countdown progress bar */}
            <div className="w-full bg-neutral-800 rounded-full h-1.5 mb-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: isRunning ? `${Math.min(100, Math.max(5, (countdown / account.delayRange[1]) * 100))}%` : '0%' 
                }}
              ></div>
            </div>

            <p className="text-sm text-neutral-200 font-medium mb-3">
              {currentStepText}
            </p>

            {/* Snapshot of last interaction */}
            {latestLog && (
              <div className="rounded border border-neutral-800 bg-neutral-900/80 p-3 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-neutral-400">Última Ação Executada:</span>
                  <span className="font-mono text-[11px] text-neutral-400">{latestLog.timestamp}</span>
                </div>
                <div className="flex items-start gap-2 text-neutral-200">
                  {latestLog.actionType === 'like' && <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                  {latestLog.actionType === 'comment' && <MessageCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                  {latestLog.actionType === 'follow' && <UserPlus className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {latestLog.actionType === 'dm' && <Send className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />}
                  <div>
                    <span className="font-semibold text-white">{latestLog.targetUser}</span>
                    <p className="text-neutral-300 mt-0.5">{latestLog.detail}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Browser environment fingerprint indicators */}
          <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-neutral-400">
            <div>
              <span className="block text-neutral-500 text-[10px]">NAVEGADOR EMULADO</span>
              <span className="font-mono text-neutral-300">Chrome 122 (Headful)</span>
            </div>
            <div>
              <span className="block text-neutral-500 text-[10px]">PROXY RESIDENCIAL</span>
              <span className="font-mono text-neutral-300 truncate block">
                {proxy ? `${proxy.ip} (${proxy.location})` : 'IP Local Seguro'}
              </span>
            </div>
            <div>
              <span className="block text-neutral-500 text-[10px]">FINGERPRINT & CANVAS</span>
              <span className="font-mono text-emerald-400">Proteção Ativa</span>
            </div>
          </div>
        </div>

        {/* Real-time view card showing current engagement target */}
        <div className="lg:col-span-5 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="text-neutral-300 font-medium">Alvo em Destaque</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Filtros Aprovados
            </span>
          </div>

          <div className="relative rounded-md overflow-hidden border border-neutral-800 mb-2 aspect-[16/9] bg-neutral-900">
            <img 
              src="/src/assets/images/post_lifestyle_fashion_1790187950485.jpg" 
              alt="Preview da publicação no Instagram"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
              <div className="text-xs text-white">
                <p className="font-semibold">@marina_fit_coach</p>
                <p className="text-[11px] text-neutral-300 truncate">Receita prática pré-treino + hábitos matinais 🥑</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>Hashtag: <strong className="text-neutral-200">#vidasaudavel</strong></span>
            <span className="font-mono tabular-nums">2.4k curtidas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
