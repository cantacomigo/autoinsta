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
import { 
  initialAccounts, 
  initialProxies, 
  defaultTargeting, 
  defaultAutomation, 
  initialLogs, 
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
import { User, signInWithPopup } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [accounts, setAccounts] = useState<InstagramAccount[]>(initialAccounts);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(initialAccounts[0].id);
  const [proxies, setProxies] = useState<ProxyConfig[]>(initialProxies);
  const [targeting, setTargeting] = useState<TargetingConfig>(defaultTargeting);
  const [automation, setAutomation] = useState<AutomationConfig>(defaultAutomation);
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>(growthHistory);
  const [isAutomationRunning, setIsAutomationRunning] = useState<boolean>(true);

  // AI Assistant Modal
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiModalType, setAiModalType] = useState<string>('spintax_comments');

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
        const storedAccounts = await firebaseService.loadAccounts(currentUser.uid);
        const storedProxies = await firebaseService.loadProxies(currentUser.uid);

        if (storedAccounts.length > 0) {
          setAccounts(storedAccounts);
          setSelectedAccountId(storedAccounts[0].id);
        } else {
          // Seed user's Firestore with initial accounts
          for (const acc of initialAccounts) {
            await firebaseService.saveAccount(currentUser.uid, acc);
          }
        }

        if (storedProxies.length > 0) {
          setProxies(storedProxies);
        } else {
          // Seed user's Firestore with initial proxies
          for (const prx of initialProxies) {
            await firebaseService.saveProxy(currentUser.uid, prx);
          }
        }
      } catch (err) {
        console.warn('Firebase data load warning:', err);
      }
    };

    loadUserData();
  }, [currentUser]);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];
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

  // Update active account and persist to Firestore
  const handleUpdateAccount = (updated: InstagramAccount) => {
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (currentUser) {
      firebaseService.saveAccount(currentUser.uid, updated);
    }
  };

  // Add new account and persist to Firestore
  const handleAddAccount = (newAcc: Partial<InstagramAccount>) => {
    const acc: InstagramAccount = {
      id: `acc_${Date.now()}`,
      username: newAcc.username || 'novo_perfil',
      displayName: newAcc.displayName || 'Novo Perfil',
      avatar: newAcc.avatar || '/src/assets/images/avatar_instagram_creator_1790187939833.jpg',
      followers: newAcc.followers || 1200,
      following: newAcc.following || 350,
      postsCount: newAcc.postsCount || 10,
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

  // Remove account and delete from Firestore
  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    if (selectedAccountId === id) {
      const remaining = accounts.filter((a) => a.id !== id);
      if (remaining.length > 0) setSelectedAccountId(remaining[0].id);
    }

    if (currentUser) {
      firebaseService.deleteAccount(currentUser.uid, id);
    }
  };

  // Add proxy and persist to Firestore
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

  // Simulate an action execution in real-time and save log to Firestore
  const executeManualAction = useCallback(() => {
    if (!selectedAccount) return;

    const possibleActions: ActionType[] = ['like', 'comment', 'follow', 'story', 'dm'];
    const selectedAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];

    const targetUsers = [
      '@carol_fitness_nutri',
      '@thiago.empreende',
      '@biomedicina_estetica',
      '@lucas.runner',
      '@mariana_lifestyle_rio',
      '@fernando_dropshipping',
      '@rafaela.saudavel',
    ];
    const targetUser = targetUsers[Math.floor(Math.random() * targetUsers.length)];

    const now = new Date();
    const timestamp = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let detail = '';
    if (selectedAction === 'like') {
      const tag = targeting.hashtags[Math.floor(Math.random() * targeting.hashtags.length)] || '#vidasaudavel';
      detail = `Curtiu ${automation.likesPerProfile} publicações recentes da hashtag ${tag}`;
    } else if (selectedAction === 'comment') {
      const template = automation.commentsSpintax[0] || 'Sensacional esse post, @{username}! 👏';
      const cleanUser = targetUser.replace('@', '');
      const parsed = parseSpintax(template, { username: cleanUser });
      detail = `Comentou: "${parsed}"`;
    } else if (selectedAction === 'follow') {
      const comp = targeting.competitorAccounts[0] || '@concorrente';
      detail = `Seguiu novo perfil (qualificado via filtros anti-bot, seguidor de ${comp})`;
    } else if (selectedAction === 'story') {
      detail = `Visualizou 4 stories e curtiu a enquete recente com sucesso`;
    } else if (selectedAction === 'dm') {
      detail = `Gatilho de direct enviado: "${automation.keywordTriggers[0]?.keyword || 'QUERO'}" com link de acesso`;
    }

    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp,
      actionType: selectedAction,
      targetUser,
      detail,
      status: 'success',
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
      />

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Context Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-5 font-mono">
          <span>AutoInsta</span>
          <span>/</span>
          <span>@{selectedAccount?.username}</span>
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
          <WarmUpSecurityView
            account={selectedAccount}
            onUpdateAccount={handleUpdateAccount}
          />
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

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AutoInsta © 2026 · Sistema Inteligente de Automação e Crescimento Seguro</span>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Sincronização em Nuvem Firestore</span>
            <span>·</span>
            <span>Proteção Anti-Ban Ativa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
