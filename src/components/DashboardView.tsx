import React, { useState } from 'react';
import { 
  Heart, 
  UserPlus, 
  MessageCircle, 
  Eye, 
  Send, 
  TrendingUp, 
  Shield, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { InstagramAccount, ProxyConfig, ActivityLog, GrowthDataPoint, ActionType } from '../types';
import { LiveSimulator } from './LiveSimulator';

interface DashboardViewProps {
  account: InstagramAccount;
  proxy?: ProxyConfig;
  isRunning: boolean;
  onToggleRunning: () => void;
  onExecuteManualAction: () => void;
  logs: ActivityLog[];
  growthData: GrowthDataPoint[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  account,
  proxy,
  isRunning,
  onToggleRunning,
  onExecuteManualAction,
  logs,
  growthData,
  onNavigateTab,
}) => {
  const [logFilter, setLogFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState<string>('');
  const [chartMode, setChartMode] = useState<'followers' | 'actions'>('followers');

  const filteredLogs = logs.filter((log) => {
    if (logFilter !== 'all' && log.actionType !== logFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      return (
        log.targetUser.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportLogsCsv = () => {
    const header = 'Timestamp,Tipo,Alvo,Detalhes,Status\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.timestamp}","${l.actionType}","${l.targetUser}","${l.detail.replace(/"/g, '""')}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autoinsta-logs-${account.username}.csv`;
    link.click();
  };

  // Safe percentages
  const likesPct = Math.round((account.dailyActions.likes / account.dailyLimits.likes) * 100);
  const followsPct = Math.round((account.dailyActions.follows / account.dailyLimits.follows) * 100);
  const storiesPct = Math.round((account.dailyActions.stories / account.dailyLimits.stories) * 100);
  const dmsPct = Math.round((account.dailyActions.dms / account.dailyLimits.dms) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner: Account Status Overview */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={account.avatar}
              alt={account.username}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-neutral-700 shadow-md"
            />
            {isRunning && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-neutral-900" title="Automação Operando"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">@{account.username}</h2>
              <span className="text-neutral-500 text-xs">·</span>
              <span className="text-xs text-neutral-300 font-medium">
                {account.status === 'active' ? 'Conta Pronta & Ativa' : 'Aquecimento em Andamento'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{account.displayName}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1.5 font-mono tabular-nums">
              <span>{account.followers.toLocaleString()} seguidores</span>
              <span className="text-neutral-600">·</span>
              <span>{account.following.toLocaleString()} seguindo</span>
              <span className="text-neutral-600">·</span>
              <span>Proxy: {proxy ? proxy.name : 'Nenhum'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Warm-up: Dia {account.warmUpDay}/{account.warmUpTotalDays}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="capitalize">Modo {account.safetyPreset}</span>
          </div>
          <button
            onClick={() => onNavigateTab('targeting')}
            className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            Ajustar Segmentação
          </button>
        </div>
      </div>

      {/* Metrics Row: 4 Single-Elevation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Curtidas */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium text-neutral-300">Curtidas Hoje</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {account.dailyActions.likes}
            </span>
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              Limite: {account.dailyLimits.likes}
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, likesPct)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono tabular-nums">
            <span>{likesPct}% do limite seguro</span>
            <span>+14 vs ontem</span>
          </div>
        </div>

        {/* Seguir Perfis */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium text-neutral-300">Seguidos Hoje</span>
            <UserPlus className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {account.dailyActions.follows}
            </span>
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              Limite: {account.dailyLimits.follows}
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, followsPct)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono tabular-nums">
            <span>{followsPct}% utilizado</span>
            <span>Follow-back ~36%</span>
          </div>
        </div>

        {/* Stories Visualizados */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium text-neutral-300">Stories Vistos</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {account.dailyActions.stories}
            </span>
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              Limite: {account.dailyLimits.stories}
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, storiesPct)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono tabular-nums">
            <span>{storiesPct}% da cota</span>
            <span>Mass Viewer Ativo</span>
          </div>
        </div>

        {/* DMs e Respostas Automáticas */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium text-neutral-300">DMs Enviadas</span>
            <Send className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {account.dailyActions.dms}
            </span>
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              Limite: {account.dailyLimits.dms}
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, dmsPct)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono tabular-nums">
            <span>{dmsPct}% do limite diário</span>
            <span>100% entregues</span>
          </div>
        </div>
      </div>

      {/* Real-time Emulation Simulator component */}
      <LiveSimulator
        account={account}
        proxy={proxy}
        isRunning={isRunning}
        onToggleRunning={onToggleRunning}
        onExecuteManualAction={onExecuteManualAction}
        logs={logs}
      />

      {/* Growth & Actions Chart Area */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              Evolução e Crescimento Real
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Crescimento de seguidores orgânicos gerados pelas ações automatizadas
            </p>
          </div>

          {/* Interactive filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-800 rounded-lg self-start">
            <button
              onClick={() => setChartMode('followers')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                chartMode === 'followers'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Seguidores (+500 na semana)
            </button>
            <button
              onClick={() => setChartMode('actions')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                chartMode === 'actions'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Volume de Ações Diárias
            </button>
          </div>
        </div>

        {/* Visual Bar Chart with high precision tabular numbers */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-4 pb-2 border-b border-neutral-800">
          {growthData.map((d, index) => {
            const minFollowers = 14200;
            const maxFollowers = 15000;
            const followerHeight = Math.max(15, Math.round(((d.followers - minFollowers) / (maxFollowers - minFollowers)) * 100));
            const actionHeight = Math.max(15, Math.round((d.actions / 300) * 100));
            const height = chartMode === 'followers' ? followerHeight : actionHeight;
            const valueLabel = chartMode === 'followers' ? d.followers.toLocaleString() : `${d.actions} ações`;

            return (
              <div key={index} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono tabular-nums text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                  {valueLabel}
                </span>
                <div 
                  className={`w-full max-w-[42px] rounded-t transition-all duration-300 ${
                    index === growthData.length - 1
                      ? 'bg-gradient-to-t from-rose-600 to-amber-500 shadow-md shadow-rose-900/30'
                      : 'bg-neutral-800 hover:bg-neutral-700'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[11px] font-mono text-neutral-400 mt-2">
                  {d.date}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 text-xs text-neutral-400 font-mono tabular-nums">
          <div className="flex items-center gap-4">
            <span>Média Diária: <strong>+71 novos seguidores</strong></span>
            <span>Taxa de Conversão: <strong>32.4%</strong></span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +3.4% nesta semana
          </span>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Registro de Atividades em Tempo Real</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Histórico detalhado de cada interação realizada no Instagram
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportLogsCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-750 text-xs font-medium text-neutral-200 transition-colors"
              title="Exportar dados como CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por @usuário ou detalhe..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-950 rounded-md border border-neutral-800">
            {['all', 'like', 'comment', 'follow', 'story', 'dm', 'warmup'].map((type) => (
              <button
                key={type}
                onClick={() => setLogFilter(type)}
                className={`px-2.5 py-1 text-xs font-medium rounded capitalize whitespace-nowrap transition-colors ${
                  logFilter === type
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {type === 'all' ? 'Todos' : type}
              </button>
            ))}
          </div>
        </div>

        {/* High-density Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="pb-2 font-medium">Horário</th>
                <th className="pb-2 font-medium">Ação</th>
                <th className="pb-2 font-medium">Alvo</th>
                <th className="pb-2 font-medium">Detalhes</th>
                <th className="pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    Nenhum registro correspondente aos filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-850/50 transition-colors">
                    <td className="py-2.5 font-mono text-neutral-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 whitespace-nowrap">
                      <span className="capitalize text-neutral-200 font-medium">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-white whitespace-nowrap">
                      {log.targetUser}
                    </td>
                    <td className="py-2.5 text-neutral-300 max-w-md truncate">
                      {log.detail}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      {log.status === 'success' && (
                        <span className="text-emerald-400 font-medium">Sucesso</span>
                      )}
                      {log.status === 'delayed' && (
                        <span className="text-amber-400 font-medium">Pausa Segura</span>
                      )}
                      {log.status === 'skipped' && (
                        <span className="text-neutral-400 font-medium">Ignorado</span>
                      )}
                      {log.status === 'warning' && (
                        <span className="text-rose-400 font-medium">Aviso</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
