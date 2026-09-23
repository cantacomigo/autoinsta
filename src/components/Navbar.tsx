import React from 'react';
import { InstagramAccount } from '../types';
import { 
  Play, 
  Pause, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  Cloud,
  User as UserIcon,
  LogIn,
  Download,
  Zap
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  accounts: InstagramAccount[];
  selectedAccount: InstagramAccount;
  onSelectAccount: (account: InstagramAccount) => void;
  isAutomationRunning: boolean;
  onToggleAutomation: () => void;
  onOpenAiModal: () => void;
  currentUser: User | null;
  onGoogleSignIn: () => void;
  onOpenRealAutomationModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  accounts,
  selectedAccount,
  onSelectAccount,
  isAutomationRunning,
  onToggleAutomation,
  onOpenAiModal,
  currentUser,
  onGoogleSignIn,
  onOpenRealAutomationModal,
}) => {
  const [accountDropdownOpen, setAccountDropdownOpen] = React.useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Painel Geral' },
    { id: 'targeting', label: 'Segmentação' },
    { id: 'engagement', label: 'Engajamento' },
    { id: 'directs', label: 'Direct & Funis' },
    { id: 'warmup', label: 'Segurança & Warm-up' },
    { id: 'accounts', label: 'Contas & Proxies' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a 
            href="#dashboard" 
            onClick={(e) => { e.preventDefault(); onSelectTab('dashboard'); }}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm shadow-rose-500/20">
              <span className="text-xs font-black">AI</span>
            </span>
            <span>AutoInsta</span>
          </a>
          <span className="hidden text-xs text-neutral-500 sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <Cloud className="w-3 h-3 text-emerald-400" />
            <span>Firebase Cloud</span>
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Real Automation button */}
          <button
            onClick={onOpenRealAutomationModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shadow cursor-pointer"
            title="Ativar ações reais no seu Instagram"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Automação Real</span>
          </button>

          {/* AI Strategy quick button */}
          <button
            onClick={onOpenAiModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md hover:bg-amber-500/20 transition-colors whitespace-nowrap"
            title="Assistente IA para Copies, Spintax e Nicho"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Assistente IA</span>
          </button>

          {/* Download Source Code ZIP button */}
          <a
            href="/api/download-zip"
            download="autoinsta-source-code.zip"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-800 hover:text-white transition-colors whitespace-nowrap"
            title="Baixar todos os arquivos do projeto em arquivo .ZIP"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Baixar .ZIP</span>
          </a>

          {/* Account Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-2 py-1.5 pl-2 pr-2.5 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-md transition-colors"
            >
              <img
                src={selectedAccount.avatar}
                alt={selectedAccount.username}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-neutral-700"
              />
              <span className="max-w-[110px] truncate text-white">@{selectedAccount.username}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {accountDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setAccountDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-neutral-800 text-xs text-neutral-400 font-medium">
                  Contas no Firebase ({accounts.length})
                </div>
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => onSelectAccount(acc)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-neutral-800 ${
                      acc.id === selectedAccount.id ? 'bg-neutral-800/80 text-white font-medium' : 'text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={acc.avatar}
                        alt={acc.username}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="truncate">
                        <p className="truncate text-white">@{acc.username}</p>
                        <p className="text-[10px] text-neutral-400">{acc.followers.toLocaleString()} seguidores</p>
                      </div>
                    </div>
                    {acc.id === selectedAccount.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                ))}
                <div className="p-1 border-t border-neutral-800">
                  <button
                    onClick={() => onSelectTab('accounts')}
                    className="w-full text-center py-1.5 text-xs text-neutral-400 hover:text-white rounded hover:bg-neutral-800/60 transition-colors"
                  >
                    + Gerenciar todas as contas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Master Start/Stop automation toggle button */}
          <button
            onClick={onToggleAutomation}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-all whitespace-nowrap ${
              isAutomationRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
            }`}
          >
            {isAutomationRunning ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="lg:hidden border-t border-neutral-800/80 bg-neutral-950/95 px-4 py-2 overflow-x-auto flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

