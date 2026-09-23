import React, { useState } from 'react';
import { 
  Users, 
  Server, 
  Plus, 
  Trash2, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Link2,
  Edit3
} from 'lucide-react';
import { InstagramAccount, ProxyConfig } from '../types';

interface AccountsProxiesViewProps {
  accounts: InstagramAccount[];
  proxies: ProxyConfig[];
  selectedAccount?: InstagramAccount | null;
  onSelectAccount: (acc: InstagramAccount) => void;
  onAddAccount: (newAcc: Partial<InstagramAccount>) => void;
  onRemoveAccount: (id: string) => void;
  onAddProxy: (newPrx: Partial<ProxyConfig>) => void;
  onRemoveProxy: (id: string) => void;
  onTestProxy: (proxy: ProxyConfig) => Promise<void>;
  onAssignProxyToAccount: (accountId: string, proxyId: string) => void;
  onEditAccount?: (acc: InstagramAccount) => void;
  onWipeAllData?: () => void;
  onRestoreDefaults?: () => void;
}

export const AccountsProxiesView: React.FC<AccountsProxiesViewProps> = ({
  accounts,
  proxies,
  selectedAccount,
  onSelectAccount,
  onAddAccount,
  onRemoveAccount,
  onAddProxy,
  onRemoveProxy,
  onTestProxy,
  onAssignProxyToAccount,
  onEditAccount,
  onWipeAllData,
  onRestoreDefaults,
}) => {
  // Modals state
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddProxyModal, setShowAddProxyModal] = useState(false);
  const [testingProxyId, setTestingProxyId] = useState<string | null>(null);

  // New Account form state
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newFollowers, setNewFollowers] = useState<number | ''>('');
  const [newFollowing, setNewFollowing] = useState<number | ''>('');
  const [newPostsCount, setNewPostsCount] = useState<number | ''>('');
  const [newAvatar, setNewAvatar] = useState('');
  const [selectedProxyForNewAcc, setSelectedProxyForNewAcc] = useState('');

  // New Proxy form state
  const [proxyName, setProxyName] = useState('');
  const [proxyType, setProxyType] = useState<'HTTP' | 'HTTPS' | 'SOCKS5'>('HTTPS');
  const [proxyHost, setProxyHost] = useState('');
  const [proxyPort, setProxyPort] = useState(8080);
  const [proxyUser, setProxyUser] = useState('');
  const [proxyPass, setProxyPass] = useState('');

  const handleCreateAccount = () => {
    if (!newUsername.trim()) return;
    let cleanUser = newUsername.trim().replace(/^@/, '');

    onAddAccount({
      username: cleanUser,
      displayName: newDisplayName.trim() || `@${cleanUser}`,
      avatar: newAvatar.trim() || '/src/assets/images/avatar_instagram_creator_1790187939833.jpg',
      followers: newFollowers !== '' ? Number(newFollowers) : 0,
      following: newFollowing !== '' ? Number(newFollowing) : 0,
      postsCount: newPostsCount !== '' ? Number(newPostsCount) : 0,
      status: 'warming_up',
      warmUpDay: 1,
      warmUpTotalDays: 7,
      proxyId: selectedProxyForNewAcc || (proxies[0]?.id ?? ''),
      safetyPreset: 'safe',
      dailyActions: { likes: 0, comments: 0, follows: 0, unfollows: 0, stories: 0, dms: 0 },
      dailyLimits: { likes: 40, comments: 15, follows: 20, unfollows: 10, stories: 300, dms: 10 },
      activeHours: { start: '09:00', end: '21:00' },
      delayRange: [60, 140],
      lastActive: 'Agora mesmo',
    });

    setNewUsername('');
    setNewDisplayName('');
    setNewFollowers('');
    setNewFollowing('');
    setNewPostsCount('');
    setNewAvatar('');
    setShowAddAccountModal(false);
  };

  const handleCreateProxy = () => {
    if (!proxyHost.trim()) return;

    onAddProxy({
      name: proxyName.trim() || `Proxy ${proxyHost.trim()}`,
      type: proxyType,
      host: proxyHost.trim(),
      port: proxyPort,
      username: proxyUser.trim(),
      password: proxyPass.trim(),
      status: 'online',
      latencyMs: Math.floor(Math.random() * 50) + 40,
      location: 'São Paulo, BR',
      ip: '189.120.44.12',
      lastChecked: 'Agora',
    });

    setProxyName('');
    setProxyHost('');
    setProxyPort(8080);
    setProxyUser('');
    setProxyPass('');
    setShowAddProxyModal(false);
  };

  const handleTestProxyClick = async (p: ProxyConfig) => {
    setTestingProxyId(p.id);
    await onTestProxy(p);
    setTestingProxyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Gestão de Múltiplas Contas e Proxies Dedicados</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Isole o endereço IP de cada perfil do Instagram com proxies residenciais e móveis 4G
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddProxyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-neutral-400" />
            <span>Novo Proxy</span>
          </button>
          <button
            onClick={() => setShowAddAccountModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Conectar Nova Conta</span>
          </button>
        </div>
      </div>

      {/* 1. Lista de Contas do Instagram */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            Perfis Instagram Gerenciados ({accounts.length})
          </h3>
          <span className="text-xs text-neutral-400">
            Conta Ativa no Painel: <strong className="text-white font-mono">{selectedAccount ? `@${selectedAccount.username}` : 'Nenhuma'}</strong>
          </span>
        </div>

        {accounts.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
            <p className="text-sm text-neutral-400 mb-3">Nenhuma conta cadastrada no momento.</p>
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 hover:bg-rose-400 text-white transition-colors cursor-pointer"
            >
              + Cadastrar Primeira Conta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {accounts.map((acc) => {
              const isCurrent = selectedAccount && acc.id === selectedAccount.id;
              const assignedProxy = proxies.find((p) => p.id === acc.proxyId);

              return (
                <div
                  key={acc.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-rose-500/80 bg-neutral-900 shadow-md'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.username}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-white">@{acc.username}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.2 rounded">
                              Painel Ativo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400">{acc.displayName}</p>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 mt-1 tabular-nums">
                          <span>{acc.followers.toLocaleString()} seguidores</span>
                          <span>·</span>
                          <span>{acc.postsCount} posts</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditAccount && onEditAccount(acc)}
                        className="text-neutral-400 hover:text-amber-400 p-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Editar dados reais desta conta"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja remover @${acc.username}? Ela não voltará ao atualizar a página.`)) {
                            onRemoveAccount(acc.id);
                          }
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Excluir conta permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                {/* Account Details & Proxy Selection */}
                <div className="pt-3 border-t border-neutral-850 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">STATUS DE AQUECIMENTO</span>
                    <span className="text-neutral-300 font-medium">
                      {acc.status === 'active' ? 'Pleno (Ativo)' : `Dia ${acc.warmUpDay} (Aquecendo)`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 block">PROXY ATRIBUÍDO</span>
                    <select
                      value={acc.proxyId}
                      onChange={(e) => onAssignProxyToAccount(acc.id, e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded p-1"
                    >
                      <option value="">Nenhum (IP Local)</option>
                      {proxies.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => onSelectAccount(acc)}
                    className="w-full mt-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
                  >
                    Alternar para esta Conta
                  </button>
                )}
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* 2. Gestor de Proxies */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Proxies Residenciais & Móveis ({proxies.length})
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Evita bloqueio de múltiplos logins no mesmo IP em conformidade com o algoritmo do Instagram
            </p>
          </div>
        </div>

        {proxies.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
            <p className="text-sm text-neutral-400 mb-3">Nenhum proxy cadastrado no momento.</p>
            <button
              onClick={() => setShowAddProxyModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
            >
              + Cadastrar Proxy Dedicado
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
          {proxies.map((proxy) => {
            const isTesting = testingProxyId === proxy.id;

            return (
              <div
                key={proxy.id}
                className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-emerald-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{proxy.name}</span>
                      <span className="font-mono text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded">
                        {proxy.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mt-1 tabular-nums">
                      <span>{proxy.host}:{proxy.port}</span>
                      <span>·</span>
                      <span>IP: {proxy.ip}</span>
                      <span>·</span>
                      <span>{proxy.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right text-xs">
                    <span className="text-emerald-400 font-mono font-medium block">
                      {proxy.latencyMs}ms
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {proxy.lastChecked}
                    </span>
                  </div>

                  <button
                    onClick={() => handleTestProxyClick(proxy)}
                    disabled={isTesting}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testando...' : 'Testar Ping'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja remover o proxy "${proxy.name}"?`)) {
                        onRemoveProxy(proxy.id);
                      }
                    }}
                    className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Excluir proxy permanentemente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* 3. Gerenciamento Geral de Dados & Reset Permanente */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Gerenciamento e Limpeza Geral de Dados</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Controle permanente do armazenamento. Seus dados são salvos localmente e sincronizados na nuvem Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onRestoreDefaults && (
              <button
                onClick={() => {
                  if (window.confirm('Deseja restaurar as contas e configurações padrão de exemplo?')) {
                    onRestoreDefaults();
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-medium transition-colors cursor-pointer"
              >
                ↺ Restaurar Dados de Exemplo
              </button>
            )}
            {onWipeAllData && (
              <button
                onClick={() => {
                  if (window.confirm('ATENÇÃO: Tem certeza que deseja excluir TUDO (todas as contas, proxies, segmentações e logs)? Ao atualizar a página, NADA voltará.')) {
                    onWipeAllData();
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 hover:border-rose-600 text-xs text-rose-300 hover:text-white font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Tudo Definitivamente</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Conectar Nova Conta */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                Conectar Nova Conta do Instagram
              </h3>
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Nome de Usuário (@username):
                </label>
                <input
                  type="text"
                  placeholder="ex: loja_fitness_oficial"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Nome de Exibição / Nicho:
                </label>
                <input
                  type="text"
                  placeholder="ex: Fitness Store | Moda & Treino"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Seguidores:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newFollowers}
                    onChange={(e) => setNewFollowers(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Seguindo:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newFollowing}
                    onChange={(e) => setNewFollowing(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Publicações:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newPostsCount}
                    onChange={(e) => setNewPostsCount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  URL da Foto de Perfil (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="https://... ou vazio para imagem padrão"
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Vincular a um Proxy Dedicado:
                </label>
                <select
                  value={selectedProxyForNewAcc}
                  onChange={(e) => setSelectedProxyForNewAcc(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                >
                  <option value="">Sem proxy (IP Local)</option>
                  {proxies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.ip})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded bg-neutral-950 p-3 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <p className="font-semibold text-neutral-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Protocolo de Segurança Meta API + Browser Real:
                </p>
                <p>
                  Novas contas iniciam automaticamente no modo de Aquecimento Gradual (Dia 1/7) para garantir longevidade.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAccount}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
              >
                Adicionar Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Proxy */}
      {showAddProxyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Cadastrar Novo Proxy
              </h3>
              <button
                onClick={() => setShowAddProxyModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Nome Identificador do Proxy:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Proxy Residencial Brasil SP #02"
                  value={proxyName}
                  onChange={(e) => setProxyName(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-neutral-300 font-medium block mb-1">Tipo:</label>
                  <select
                    value={proxyType}
                    onChange={(e) => setProxyType(e.target.value as any)}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                  >
                    <option value="HTTPS">HTTPS</option>
                    <option value="HTTP">HTTP</option>
                    <option value="SOCKS5">SOCKS5</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-neutral-300 font-medium block mb-1">Porta:</label>
                  <input
                    type="number"
                    value={proxyPort}
                    onChange={(e) => setProxyPort(parseInt(e.target.value, 10) || 8080)}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Host / IP do Proxy:
                </label>
                <input
                  type="text"
                  placeholder="ex: br-residential.proxy.net"
                  value={proxyHost}
                  onChange={(e) => setProxyHost(e.target.value)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Usuário (opcional):</label>
                  <input
                    type="text"
                    value={proxyUser}
                    onChange={(e) => setProxyUser(e.target.value)}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Senha (opcional):</label>
                  <input
                    type="password"
                    value={proxyPass}
                    onChange={(e) => setProxyPass(e.target.value)}
                    className="w-full rounded border border-neutral-800 bg-neutral-950 p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowAddProxyModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProxy}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
              >
                Salvar Proxy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
