import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Flame, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { InstagramAccount, SafetyPreset } from '../types';

interface WarmUpSecurityViewProps {
  account: InstagramAccount;
  onUpdateAccount: (updated: InstagramAccount) => void;
}

export const WarmUpSecurityView: React.FC<WarmUpSecurityViewProps> = ({
  account,
  onUpdateAccount,
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const applyPreset = (preset: SafetyPreset) => {
    let limits = { ...account.dailyLimits };
    let delay: [number, number] = [45, 95];

    if (preset === 'safe') {
      limits = { likes: 40, comments: 15, follows: 20, unfollows: 15, stories: 300, dms: 10 };
      delay = [60, 140];
    } else if (preset === 'moderate') {
      limits = { likes: 120, comments: 35, follows: 50, unfollows: 50, stories: 800, dms: 30 };
      delay = [45, 95];
    } else if (preset === 'aggressive') {
      limits = { likes: 250, comments: 60, follows: 100, unfollows: 100, stories: 1500, dms: 60 };
      delay = [30, 65];
    }

    onUpdateAccount({
      ...account,
      safetyPreset: preset,
      dailyLimits: limits,
      delayRange: delay,
    });

    setFeedback(`Modo ${preset.toUpperCase()} aplicado com sucesso!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const setWarmUpDay = (day: number) => {
    onUpdateAccount({
      ...account,
      warmUpDay: day,
      status: day >= account.warmUpTotalDays ? 'active' : 'warming_up',
    });
  };

  const updateHours = (field: 'start' | 'end', val: string) => {
    onUpdateAccount({
      ...account,
      activeHours: {
        ...account.activeHours,
        [field]: val,
      },
    });
  };

  const updateDelay = (index: 0 | 1, val: number) => {
    const next: [number, number] = [...account.delayRange];
    next[index] = val;
    onUpdateAccount({
      ...account,
      delayRange: next,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Central de Segurança, Anti-Ban e Aquecimento de Contas</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Sistemas patenteados para operar simulando comportamento 100% humano no Instagram
          </p>
        </div>

        {feedback && (
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {feedback}
          </div>
        )}
      </div>

      {/* 1. Presets Operacionais */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Presets de Operação e Tolerância a Risco
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Seguro */}
          <div
            onClick={() => applyPreset('safe')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              account.safetyPreset === 'safe'
                ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-950/20'
                : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-emerald-400">Modo Seguro</span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">Risco Quase Zero</span>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Ideal para contas novas ou recém-conectadas. Limites suaves com pausas longas.
            </p>
            <div className="text-xs font-mono tabular-nums text-neutral-300 space-y-1 pt-2 border-t border-neutral-850">
              <div className="flex justify-between"><span>Curtidas/dia:</span> <strong>40</strong></div>
              <div className="flex justify-between"><span>Seguidos/dia:</span> <strong>20</strong></div>
              <div className="flex justify-between"><span>Delay entre ações:</span> <strong>60-140s</strong></div>
            </div>
          </div>

          {/* Moderado */}
          <div
            onClick={() => applyPreset('moderate')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              account.safetyPreset === 'moderate'
                ? 'border-amber-500 bg-amber-950/20 shadow-md shadow-amber-950/20'
                : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-amber-400">Modo Moderado</span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">Mais Popular</span>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Equilíbrio ideal entre crescimento rápido e total estabilidade no perfil.
            </p>
            <div className="text-xs font-mono tabular-nums text-neutral-300 space-y-1 pt-2 border-t border-neutral-850">
              <div className="flex justify-between"><span>Curtidas/dia:</span> <strong>120</strong></div>
              <div className="flex justify-between"><span>Seguidos/dia:</span> <strong>50</strong></div>
              <div className="flex justify-between"><span>Delay entre ações:</span> <strong>45-95s</strong></div>
            </div>
          </div>

          {/* Agressivo */}
          <div
            onClick={() => applyPreset('aggressive')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              account.safetyPreset === 'aggressive'
                ? 'border-rose-500 bg-rose-950/20 shadow-md shadow-rose-950/20'
                : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-rose-400">Modo Agressivo</span>
              <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded">Escala Máxima</span>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Recomendado exclusivamente para perfis antigos com mais de 6 meses e proxy móvel 4G.
            </p>
            <div className="text-xs font-mono tabular-nums text-neutral-300 space-y-1 pt-2 border-t border-neutral-850">
              <div className="flex justify-between"><span>Curtidas/dia:</span> <strong>250</strong></div>
              <div className="flex justify-between"><span>Seguidos/dia:</span> <strong>100</strong></div>
              <div className="flex justify-between"><span>Delay entre ações:</span> <strong>30-65s</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Régua de Aquecimento Gradual (Warm-Up 7 Dias) */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Régua de Aquecimento Progressivo (Warm-up Inteligente)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Acelera aos poucos a quantidade de ações diárias para passar despercebido pelos algoritmos
            </p>
          </div>

          <div className="text-xs text-neutral-300 font-mono">
            Status: <strong className="text-amber-400">Dia {account.warmUpDay} de {account.warmUpTotalDays}</strong>
          </div>
        </div>

        {/* Interactive Step Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
            const isCompleted = day <= account.warmUpDay;
            const isCurrent = day === account.warmUpDay;

            return (
              <button
                key={day}
                onClick={() => setWarmUpDay(day)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                    : isCompleted
                    ? 'border-neutral-800 bg-neutral-950/80 hover:bg-neutral-850'
                    : 'border-neutral-850 bg-neutral-950/30 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white font-mono">Dia {day}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  {day === 1 && '15% da cota'}
                  {day === 2 && '30% da cota'}
                  {day === 3 && '45% da cota'}
                  {day === 4 && '60% da cota'}
                  {day === 5 && '75% da cota'}
                  {day === 6 && '90% da cota'}
                  {day === 7 && '100% Pleno'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Horários Ativos e Delays Humanizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Horários de Operação */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="w-4 h-4 text-rose-400" />
            Horário Ativo de Operação (Descanso Noturno)
          </div>
          <p className="text-xs text-neutral-400">
            O robô suspende automaticamente as ações durante a madrugada para simular a rotina humana.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">INÍCIO DA OPERAÇÃO</label>
              <input
                type="time"
                value={account.activeHours.start}
                onChange={(e) => updateHours('start', e.target.value)}
                className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">TÉRMINO DA OPERAÇÃO</label>
              <input
                type="time"
                value={account.activeHours.end}
                onChange={(e) => updateHours('end', e.target.value)}
                className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Delays Aleatórios Humanizados */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Intervalo Aleatório entre Ações (Delays)
          </div>
          <p className="text-xs text-neutral-400">
            Evita tempos fixos exatos que são o maior fator de detecção de bots.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">DELAY MÍNIMO (SEGUNDOS)</label>
              <input
                type="number"
                value={account.delayRange[0]}
                onChange={(e) => updateDelay(0, parseInt(e.target.value, 10) || 30)}
                className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">DELAY MÁXIMO (SEGUNDOS)</label>
              <input
                type="number"
                value={account.delayRange[1]}
                onChange={(e) => updateDelay(1, parseInt(e.target.value, 10) || 90)}
                className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
