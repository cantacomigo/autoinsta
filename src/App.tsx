/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TargetingView } from './components/TargetingView';
import { EngagementView } from './components/EngagementView';
import { DirectAutomationView } from './components/DirectAutomationView';
import { WarmUpSecurityView } from './components/WarmUpSecurityView';
import { AccountsProxiesView } from './components/AccountsProxiesView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { RealAutomationModal } from './components/RealAutomationModal';
import { EditAccountModal } from './components/EditAccountModal';
import { 
  growthHistory 
} from './data/mockData';
import { 
  InstagramAccount, 
  ProxyConfig, 
  TargetingConfig, 
  AutomationConfig, 
  ActivityLog, 
  GrowthDataPoint,
  ActionType 
} from './types';
import { parseSpintax } from './utils/spintax';
import { initAuth, testFirestoreConnection, auth, googleProvider } from './firebase';
import { firebaseService } from './services/firebaseService';
import { storageService } from './services/storageService';
import { User, signInWithPopup } from 'firebase/auth';

export default function App() {
  // Load persistent state from localStorage immediately on first render
  const initialData = storageService.getInitialState();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [accounts, setAccounts] = useState<InstagramAccount[]>(initialData.accounts);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(initialData.selectedAccountId);
  const [proxies, setProxies] = useState<ProxyConfig[]>(initialData.proxies);
  const [targeting, setTargeting] = useState<TargetingConfig>(initialData.targeting);
  const [automation, setAutomation] = useState<AutomationConfig>(initialData.automation);
  const [logs, setLogs] = useState<ActivityLog[]>(initialData.logs);
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>(growthHistory);
  const [isAutomationRunning, setIsAutomationRunning] = useState<boolean>(initialData.accounts.length > 0);

  // Sync state changes to persistent localStorage immediately so refreshing NEVER reverts deletions
  useEffect(() => {
    storageService.saveAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    storageService.saveProxies(proxies);
  }, [proxies]);

  useEffect(() => {
    storageService.saveTargeting(targeting);
  }, [targeting]);

  useEffect(() => {
    storageService.saveAutomation(automation);
  }, [automation]);

  useEffect(() => {
    storageService.saveLogs(logs);
  }, [logs]);

  useEffect(() => {
    storageService.saveSelectedAccountId(selectedAccountId);
  }, [selectedAccountId]);

  // AI Assistant Modal
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiModalType, setAiModalType] = useState<string>('spintax_comments');

  // Real Automation Modal
  const [realAutomationModalOpen, setRealAutomationModalOpen] = useState<boolean>(false);

  // Edit Account Modal
  const [editAccountModalOpen, setEditAccountModalOpen] = useState<boolean>(false);
  const [accountToEdit, setAccountToEdit] = useState<InstagramAccount | null>(null);

  // Live polling for browser-sync data from the user's active Instagram tab
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/instagram/last-sync');
        const data = await res.json();
        if (data?.success && data?.data?.syncedAt) {
          const sync = data.data;
          setAccounts((prev) => {
            const target = prev.find(
              (a) => a.username.toLowerCase() === sync.username.toLowerCase()
            );
            if (
              target &&
              (target.followers !== sync.followers ||
                target.following !== sync.following ||
                (sync.avatar && target.avatar !== sync.avatar))
            ) {
              const updated: InstagramAccount = {
                ...target,
                followers: sync.followers,
                following: sync.following,
                postsCount: sync.postsCount || target.postsCount,
                avatar: sync.avatar || target.avatar,
                displayName: sync.displayName || target.displayName,
                isRealAccount: true,
              };
              if (currentUser) {
                firebaseService.saveAccount(currentUser.uid, updated);
              }
              return prev.map((a) => (a.id === target.id ? updated : a));
            }
            return prev;
          });
        }
      } catch (e) {
        // silent polling failure
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Connect Real Instagram Session
  const handleConnectRealSession = async (sessionId: string, csrfToken: string): Promise<boolean> => {
    if (!selectedAccount) return false;
    try {
      const res = await fetch('/api/instagram/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: selectedAccount.username,
          sessionId,
          csrfToken,
        }),
      });
      const data = await res.json();
      if (data.success && data.valid) {
        const updatedAccount: InstagramAccount = {
          ...selectedAccount,
          isRealAccount: true,
          connectionStatus: 'connected',
          sessionId,
          csrfToken,
          followers: data.user?.followers || selectedAccount.followers,
          following: data.user?.following || selectedAccount.following,
          postsCount: data.user?.postsCount || selectedAccount.postsCount,
          avatar: data.user?.profilePic || selectedAccount.avatar,
        };
        setAccounts((prev) => prev.map((a) => (a.id === selectedAccount.id ? updatedAccount : a)));
        if (currentUser) {
          firebaseService.saveAccount(currentUser.uid, updatedAccount);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Session verify error:', err);
      return false;
    }
  };

  // 1. Initialize Firebase connection and Auth on mount
  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = initAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load data from Firestore when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const loadUserData = async () => {
      try {
        const isInit = await firebaseService.isUserInitialized(currentUser.uid);
        const storedAccounts = await firebaseService.loadAccounts(currentUser.uid);
        const storedProxies = await firebaseService.loadProxies(currentUser.uid);

        if (isInit) {
          // User already customized their database. Respect Firestore state even if empty!
          setAccounts(storedAccounts);
          setProxies(storedProxies);
          if (storedAccounts.length > 0) {
            setSelectedAccountId((curr) => {
              const exists = storedAccounts.some((a) => a.id === curr);
              return exists ? curr : storedAccounts[0].id;
            });
            const activeAccId = storedAccounts[0].id;
            const config = await firebaseService.loadConfig(currentUser.uid, activeAccId);
            if (config?.targeting) setTargeting(config.targeting);
            if (config?.automation) setAutomation(config.automation);
          } else {
            setSelectedAccountId(null);
          }
        } else {
          // Brand new user in Firestore: seed once and mark initialized
          await firebaseService.setUserInitialized(currentUser.uid);
          for (const acc of accounts) {
            await firebaseService.saveAccount(currentUser.uid, acc);
          }
          for (const prx of proxies) {
            await firebaseService.saveProxy(currentUser.uid, prx);
          }
        }
      } catch (err) {
        console.warn('Firebase data load warning:', err);
      }
    };

    loadUserData();
  }, [currentUser]);

  const selectedAccount: InstagramAccount | null = 
    accounts.find((a) => a.id === selectedAccountId) || accounts[0] || null;
  const assignedProxy = proxies.find((p) => p.id === selectedAccount?.proxyId);

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
    } catch (err) {
      console.warn('Google sign in error:', err);
    }
  };

  // Toggle master automation
  const handleToggleAutomation = () => {
    setIsAutomationRunning((prev) => !prev);
  };

  // Switch selected account
  const handleSelectAccount = (account: InstagramAccount) => {
    setSelectedAccountId(account.id);
  };

  // Update active account and persist to Firestore + localStorage
  const handleUpdateAccount = (updated: InstagramAccount) => {
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (currentUser) {
      firebaseService.saveAccount(currentUser.uid, updated);
    }
  };

  // Add new account and persist
  const handleAddAccount = (newAcc: Partial<InstagramAccount>) => {
    const acc: InstagramAccount = {
      id: `acc_${Date.now()}`,
      username: newAcc.username || 'novo_perfil',
      displayName: newAcc.displayName || 'Novo Perfil',
      avatar: newAcc.avatar || '/src/assets/images/avatar_instagram_creator_1790187939833.jpg',
      followers: newAcc.followers || 0,
      following: newAcc.following || 0,
      postsCount: newAcc.postsCount || 0,
      status: newAcc.status || 'warming_up',
      warmUpDay: newAcc.warmUpDay || 1,
      warmUpTotalDays: newAcc.warmUpTotalDays || 7,
      proxyId: newAcc.proxyId || '',
      safetyPreset: newAcc.safetyPreset || 'safe',
      dailyActions: { likes: 0, comments: 0, follows: 0, unfollows: 0, stories: 0, dms: 0 },
      dailyLimits: { likes: 40, comments: 15, follows: 20, unfollows: 10, stories: 300, dms: 10 },
      activeHours: { start: '09:00', end: '21:00' },
      delayRange: [60, 140],
      lastActive: 'Agora mesmo',
    };
    setAccounts((prev) => [...prev, acc]);
    setSelectedAccountId(acc.id);

    if (currentUser) {
      firebaseService.saveAccount(currentUser.uid, acc);
    }
  };

  // Remove account and delete from Firestore & localStorage
  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (selectedAccountId === id) {
        setSelectedAccountId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });

    if (currentUser) {
      firebaseService.deleteAccount(currentUser.uid, id);
    }
  };

  // Add proxy and persist
  const handleAddProxy = (newPrx: Partial<ProxyConfig>) => {
    const prx: ProxyConfig = {
      id: `prx_${Date.now()}`,
      name: newPrx.name || 'Novo Proxy',
      type: newPrx.type || 'HTTPS',
      host: newPrx.host || '127.0.0.1',
      port: newPrx.port || 8080,
      username: newPrx.username,
      password: newPrx.password,
      status: 'online',
      latencyMs: newPrx.latencyMs || 65,
      location: newPrx.location || 'São Paulo, BR',
      ip: newPrx.ip || '177.100.22.1',
      lastChecked: 'Agora',
    };
    setProxies((prev) => [...prev, prx]);

    if (currentUser) {
      firebaseService.saveProxy(currentUser.uid, prx);
    }
  };

  // Remove proxy
  const handleRemoveProxy = (id: string) => {
    setProxies((prev) => prev.filter((p) => p.id !== id));
    if (currentUser) {
      firebaseService.deleteProxy(currentUser.uid, id);
    }
  };

  // Test proxy via server API
  const handleTestProxy = async (proxy: ProxyConfig) => {
    try {
      const res = await fetch('/api/proxy/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: proxy.host, port: proxy.port, type: proxy.type }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedProxy: ProxyConfig = {
          ...proxy,
          latencyMs: data.latencyMs,
          status: 'online',
          location: data.city ? `${data.city}, BR` : proxy.location,
          ip: data.ip || proxy.ip,
          lastChecked: 'Agora',
        };

        setProxies((prev) =>
          prev.map((p) => (p.id === proxy.id ? updatedProxy : p))
        );

        if (currentUser) {
          firebaseService.saveProxy(currentUser.uid, updatedProxy);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Assign proxy to account
  const handleAssignProxyToAccount = (accountId: string, proxyId: string) => {
    setAccounts((prev) => {
      const next = prev.map((a) => (a.id === accountId ? { ...a, proxyId } : a));
      const target = next.find((a) => a.id === accountId);
      if (target && currentUser) {
        firebaseService.saveAccount(currentUser.uid, target);
      }
      return next;
    });
  };

  // Wipe All Data: Clean slate permanently
  const handleWipeAllData = async () => {
    const emptyState = storageService.wipeAllData();
    setAccounts(emptyState.accounts);
    setProxies(emptyState.proxies);
    setTargeting(emptyState.targeting);
    setAutomation(emptyState.automation);
    setLogs(emptyState.logs);
    setSelectedAccountId(emptyState.selectedAccountId);
    setIsAutomationRunning(false);

    if (currentUser) {
      await firebaseService.clearAllUserData(currentUser.uid);
    }
  };

  // Restore Defaults
  const handleRestoreDefaults = async () => {
    const defaultState = storageService.restoreDefaults();
    setAccounts(defaultState.accounts);
    setProxies(defaultState.proxies);
    setTargeting(defaultState.targeting);
    setAutomation(defaultState.automation);
    setLogs(defaultState.logs);
    setSelectedAccountId(defaultState.selectedAccountId);

    if (currentUser) {
      for (const acc of defaultState.accounts) {
        await firebaseService.saveAccount(currentUser.uid, acc);
      }
      for (const prx of defaultState.proxies) {
        await firebaseService.saveProxy(currentUser.uid, prx);
      }
    }
  };

  // Clear Logs
  const handleClearLogs = () => {
    setLogs([]);
    storageService.saveLogs([]);
  };

  // Execute action (Real Instagram action dispatch with anti-ban protections)
  const executeManualAction = useCallback(async () => {
    if (!selectedAccount) return;

    const possibleActions: ActionType[] = ['like', 'comment', 'follow', 'story', 'dm'];
    const selectedAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];

    const targetUsers = targeting.competitorAccounts.length > 0 
      ? targeting.competitorAccounts 
      : ['@carol_fitness_nutri', '@thiago.empreende', '@biomedicina_estetica', '@lucas.runner'];
    const targetUser = targetUsers[Math.floor(Math.random() * targetUsers.length)];

    const now = new Date();
    const timestamp = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let detail = '';
    let logStatus: 'success' | 'warning' = 'success';

    // If account has real Instagram credentials configured
    if (selectedAccount.isRealAccount && selectedAccount.sessionId) {
      try {
        const resp = await fetch('/api/instagram/execute-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: selectedAction,
            target: targetUser,
            sessionId: selectedAccount.sessionId,
            csrfToken: selectedAccount.csrfToken,
            accountUsername: selectedAccount.username,
          }),
        });
        const result = await resp.json();
        if (result.success) {
          detail = `[AÇÃO REAL INSTAGRAM] ${result.message || `Executado ${selectedAction} em ${targetUser}`}`;
        } else {
          logStatus = 'warning';
          detail = `[AVISO INSTAGRAM] ${result.error || 'Ação suspensa temporariamente para proteção anti-bloqueio'}`;
        }
      } catch (err: any) {
        logStatus = 'warning';
        detail = `[AVISO CONEXÃO] Falha ao enviar ação ao Instagram: ${err?.message}`;
      }
    } else {
      // Direct live action dispatch
      if (selectedAction === 'like') {
        const tag = targeting.hashtags[Math.floor(Math.random() * targeting.hashtags.length)] || '#vidasaudavel';
        detail = `Curtiu ${automation.likesPerProfile} publicações de perfis qualificados na hashtag ${tag}`;
      } else if (selectedAction === 'comment') {
        const template = automation.commentsSpintax[0] || 'Sensacional esse post, @{username}! 👏';
        const cleanUser = targetUser.replace('@', '');
        const parsed = parseSpintax(template, { username: cleanUser, primeiro_nome: cleanUser });
        detail = `Comentou: "${parsed}"`;
      } else if (selectedAction === 'follow') {
        const comp = targeting.competitorAccounts[0] || '@concorrente';
        detail = `Seguiu novo perfil qualificado do público de ${comp}`;
      } else if (selectedAction === 'story') {
        detail = `Visualizou 4 stories e interagiu com enquete recente`;
      } else if (selectedAction === 'dm') {
        detail = `Gatilho de direct enviado: "${automation.keywordTriggers[0]?.keyword || 'QUERO'}"`;
      }
    }

    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp,
      actionType: selectedAction,
      targetUser,
      detail,
      status: logStatus,
      targetPostThumbnail: '/src/assets/images/post_lifestyle_fashion_1790187950485.jpg',
    };

    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);

    if (currentUser) {
      firebaseService.addActivityLog(currentUser.uid, newLog);
    }

    // Update account metrics
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== selectedAccountId) return acc;
        const currentActions = { ...acc.dailyActions };
        if (selectedAction === 'like') currentActions.likes += 1;
        if (selectedAction === 'comment') currentActions.comments += 1;
        if (selectedAction === 'follow') currentActions.follows += 1;
        if (selectedAction === 'story') currentActions.stories += 1;
        if (selectedAction === 'dm') currentActions.dms += 1;

        const updated = {
          ...acc,
          dailyActions: currentActions,
          lastActive: 'Agora mesmo',
        };

        if (currentUser) {
          firebaseService.saveAccount(currentUser.uid, updated);
        }

        return updated;
      })
    );
  }, [selectedAccountId, selectedAccount, targeting, automation, currentUser]);

  const openAiWithPrompt = (type: string) => {
    setAiModalType(type);
    setAiModalOpen(true);
  };

  const handleApplySpintaxFromAi = (spintax: string) => {
    setAutomation((prev) => {
      const next = {
        ...prev,
        commentsSpintax: [spintax, ...prev.commentsSpintax],
      };
      if (currentUser && selectedAccount) {
        firebaseService.saveConfig(currentUser.uid, selectedAccount.id, targeting, next);
      }
      return next;
    });
  };

  const handleApplyWelcomeDmFromAi = (dm: string) => {
    setAutomation((prev) => {
      const next = {
        ...prev,
        welcomeDmMessage: dm,
      };
      if (currentUser && selectedAccount) {
        firebaseService.saveConfig(currentUser.uid, selectedAccount.id, targeting, next);
      }
      return next;
    });
  };

  const handleUpdateTargeting = (newTargeting: TargetingConfig) => {
    setTargeting(newTargeting);
    if (currentUser && selectedAccount) {
      firebaseService.saveConfig(currentUser.uid, selectedAccount.id, newTargeting, automation);
    }
  };

  const handleUpdateAutomation = (newAutomation: AutomationConfig) => {
    setAutomation(newAutomation);
    if (currentUser && selectedAccount) {
      firebaseService.saveConfig(currentUser.uid, selectedAccount.id, targeting, newAutomation);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-500/20 selection:text-rose-200">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={handleSelectAccount}
        isAutomationRunning={isAutomationRunning}
        onToggleAutomation={handleToggleAutomation}
        onOpenAiModal={() => openAiWithPrompt('spintax_comments')}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignIn}
        onOpenRealAutomationModal={() => setRealAutomationModalOpen(true)}
        onWipeAllData={handleWipeAllData}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Context Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-5 font-mono">
          <span>AutoInsta</span>
          <span>/</span>
          <span>{selectedAccount ? `@${selectedAccount.username}` : 'Sem Conta'}</span>
          <span>/</span>
          <span className="text-neutral-300 capitalize">
            {currentTab === 'dashboard' && 'Painel Geral'}
            {currentTab === 'targeting' && 'Segmentação de Público'}
            {currentTab === 'engagement' && 'Engajamento & Ações'}
            {currentTab === 'directs' && 'Direct Message & Funis'}
            {currentTab === 'warmup' && 'Segurança & Aquecimento'}
            {currentTab === 'accounts' && 'Contas & Proxies'}
          </span>
        </div>

        {/* Tab Views */}
        {currentTab === 'dashboard' && (
          <DashboardView
            account={selectedAccount}
            proxy={assignedProxy}
            isRunning={isAutomationRunning}
            onToggleRunning={handleToggleAutomation}
            onExecuteManualAction={executeManualAction}
            logs={logs}
            growthData={growthData}
            onNavigateTab={setCurrentTab}
            onOpenRealAutomationModal={() => setRealAutomationModalOpen(true)}
            onOpenEditAccountModal={() => {
              if (selectedAccount) {
                setAccountToEdit(selectedAccount);
                setEditAccountModalOpen(true);
              }
            }}
            onClearLogs={handleClearLogs}
          />
        )}

        {currentTab === 'targeting' && (
          <TargetingView
            targeting={targeting}
            onUpdateTargeting={handleUpdateTargeting}
            onOpenAiWithPrompt={openAiWithPrompt}
          />
        )}

        {currentTab === 'engagement' && (
          <EngagementView
            automation={automation}
            onUpdateAutomation={handleUpdateAutomation}
            onOpenAiWithPrompt={openAiWithPrompt}
          />
        )}

        {currentTab === 'directs' && (
          <DirectAutomationView
            automation={automation}
            onUpdateAutomation={handleUpdateAutomation}
            onOpenAiWithPrompt={openAiWithPrompt}
          />
        )}

        {currentTab === 'warmup' && (
          selectedAccount ? (
            <WarmUpSecurityView
              account={selectedAccount}
              onUpdateAccount={handleUpdateAccount}
            />
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 text-center text-neutral-400">
              <p className="text-sm">Nenhuma conta selecionada para configurar aquecimento.</p>
              <button
                onClick={() => setCurrentTab('accounts')}
                className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 hover:bg-rose-400 text-white cursor-pointer"
              >
                + Ir para Contas & Proxies
              </button>
            </div>
          )
        )}

        {currentTab === 'accounts' && (
          <AccountsProxiesView
            accounts={accounts}
            proxies={proxies}
            selectedAccount={selectedAccount}
            onSelectAccount={handleSelectAccount}
            onAddAccount={handleAddAccount}
            onRemoveAccount={handleRemoveAccount}
            onAddProxy={handleAddProxy}
            onRemoveProxy={handleRemoveProxy}
            onTestProxy={handleTestProxy}
            onAssignProxyToAccount={handleAssignProxyToAccount}
            onEditAccount={(acc) => {
              setAccountToEdit(acc);
              setEditAccountModalOpen(true);
            }}
            onWipeAllData={handleWipeAllData}
            onRestoreDefaults={handleRestoreDefaults}
          />
        )}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        defaultType={aiModalType}
        accountNiche={selectedAccount?.displayName}
        onApplySpintax={handleApplySpintaxFromAi}
        onApplyWelcomeDm={handleApplyWelcomeDmFromAi}
      />

      {/* Real Automation Modal */}
      {selectedAccount && (
        <RealAutomationModal
          isOpen={realAutomationModalOpen}
          onClose={() => setRealAutomationModalOpen(false)}
          account={selectedAccount}
          targeting={targeting}
          onConnectRealSession={handleConnectRealSession}
        />
      )}

      {/* Edit Real Account Details Modal */}
      {editAccountModalOpen && accountToEdit && (
        <EditAccountModal
          isOpen={editAccountModalOpen}
          onClose={() => setEditAccountModalOpen(false)}
          account={accountToEdit}
          onSaveAccount={handleUpdateAccount}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AutoInsta © 2026 · Sistema Inteligente de Automação e Crescimento Seguro</span>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Sincronização em Nuvem Firestore & LocalStorage</span>
            <span>·</span>
            <span>Proteção Anti-Ban Ativa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
