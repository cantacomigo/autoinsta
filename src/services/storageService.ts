import { InstagramAccount, ProxyConfig, TargetingConfig, AutomationConfig, ActivityLog } from '../types';
import { initialAccounts, initialProxies, defaultTargeting, defaultAutomation, initialLogs } from '../data/mockData';

const STORAGE_KEYS = {
  HAS_INITIALIZED: 'autoinsta_has_initialized',
  ACCOUNTS: 'autoinsta_accounts_v1',
  PROXIES: 'autoinsta_proxies_v1',
  TARGETING: 'autoinsta_targeting_v1',
  AUTOMATION: 'autoinsta_automation_v1',
  LOGS: 'autoinsta_logs_v1',
  SELECTED_ACC_ID: 'autoinsta_selected_account_id',
};

export interface StoredAppState {
  accounts: InstagramAccount[];
  proxies: ProxyConfig[];
  targeting: TargetingConfig;
  automation: AutomationConfig;
  logs: ActivityLog[];
  selectedAccountId: string | null;
}

export const storageService = {
  // Load initial state with persistent localStorage guarantee
  getInitialState(): StoredAppState {
    try {
      const hasInitialized = localStorage.getItem(STORAGE_KEYS.HAS_INITIALIZED);

      // If user has visited and customized before (even if they deleted everything)
      if (hasInitialized === 'true') {
        const rawAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
        const rawProxies = localStorage.getItem(STORAGE_KEYS.PROXIES);
        const rawTargeting = localStorage.getItem(STORAGE_KEYS.TARGETING);
        const rawAutomation = localStorage.getItem(STORAGE_KEYS.AUTOMATION);
        const rawLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
        const rawSelectedAccId = localStorage.getItem(STORAGE_KEYS.SELECTED_ACC_ID);

        const accounts: InstagramAccount[] = rawAccounts !== null ? JSON.parse(rawAccounts) : [];
        const proxies: ProxyConfig[] = rawProxies !== null ? JSON.parse(rawProxies) : [];
        const targeting: TargetingConfig = rawTargeting !== null ? JSON.parse(rawTargeting) : defaultTargeting;
        const automation: AutomationConfig = rawAutomation !== null ? JSON.parse(rawAutomation) : defaultAutomation;
        const logs: ActivityLog[] = rawLogs !== null ? JSON.parse(rawLogs) : [];
        const selectedAccountId: string | null = rawSelectedAccId || (accounts[0]?.id ?? null);

        return { accounts, proxies, targeting, automation, logs, selectedAccountId };
      }

      // First time visitor: seed default templates and immediately mark as initialized
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
      localStorage.setItem(STORAGE_KEYS.PROXIES, JSON.stringify(initialProxies));
      localStorage.setItem(STORAGE_KEYS.TARGETING, JSON.stringify(defaultTargeting));
      localStorage.setItem(STORAGE_KEYS.AUTOMATION, JSON.stringify(defaultAutomation));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(initialLogs));
      localStorage.setItem(STORAGE_KEYS.SELECTED_ACC_ID, initialAccounts[0]?.id || '');

      return {
        accounts: initialAccounts,
        proxies: initialProxies,
        targeting: defaultTargeting,
        automation: defaultAutomation,
        logs: initialLogs,
        selectedAccountId: initialAccounts[0]?.id || null,
      };
    } catch (e) {
      console.warn('Storage read warning:', e);
      return {
        accounts: initialAccounts,
        proxies: initialProxies,
        targeting: defaultTargeting,
        automation: defaultAutomation,
        logs: initialLogs,
        selectedAccountId: initialAccounts[0]?.id || null,
      };
    }
  },

  saveAccounts(accounts: InstagramAccount[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Storage save accounts error:', e);
    }
  },

  saveProxies(proxies: ProxyConfig[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.PROXIES, JSON.stringify(proxies));
    } catch (e) {
      console.warn('Storage save proxies error:', e);
    }
  },

  saveTargeting(targeting: TargetingConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.TARGETING, JSON.stringify(targeting));
    } catch (e) {
      console.warn('Storage save targeting error:', e);
    }
  },

  saveAutomation(automation: AutomationConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.AUTOMATION, JSON.stringify(automation));
    } catch (e) {
      console.warn('Storage save automation error:', e);
    }
  },

  saveLogs(logs: ActivityLog[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('Storage save logs error:', e);
    }
  },

  saveSelectedAccountId(id: string | null) {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.SELECTED_ACC_ID, id || '');
    } catch (e) {
      console.warn('Storage save selected account error:', e);
    }
  },

  // Completely wipe all data to zero, preventing any resurrection on reload
  wipeAllData(): StoredAppState {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.PROXIES, JSON.stringify([]));
      
      const emptyTargeting: TargetingConfig = {
        hashtags: [],
        competitorAccounts: [],
        locations: [],
        exploreFeed: false,
        postCommenters: [],
        filters: {
          minFollowers: 0,
          maxFollowers: 50000,
          hasProfilePic: true,
          hasBio: false,
          minPosts: 0,
          accountType: 'all',
          skipPrivate: false,
        },
      };

      const emptyAutomation: AutomationConfig = {
        likePosts: false,
        likesPerProfile: 1,
        commentPosts: false,
        commentsSpintax: [],
        followUsers: false,
        unfollowUsers: false,
        unfollowAfterDays: 3,
        unfollowOnlyNonFollowers: true,
        whitelist: [],
        viewStories: false,
        likeStories: false,
        reactPolls: false,
        welcomeDmEnabled: false,
        welcomeDmMessage: '',
        keywordTriggers: [],
      };

      localStorage.setItem(STORAGE_KEYS.TARGETING, JSON.stringify(emptyTargeting));
      localStorage.setItem(STORAGE_KEYS.AUTOMATION, JSON.stringify(emptyAutomation));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.SELECTED_ACC_ID, '');

      return {
        accounts: [],
        proxies: [],
        targeting: emptyTargeting,
        automation: emptyAutomation,
        logs: [],
        selectedAccountId: null,
      };
    } catch (e) {
      console.warn('Storage wipe error:', e);
      return {
        accounts: [],
        proxies: [],
        targeting: defaultTargeting,
        automation: defaultAutomation,
        logs: [],
        selectedAccountId: null,
      };
    }
  },

  // Reset to initial demo templates if desired
  restoreDefaults(): StoredAppState {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
      localStorage.setItem(STORAGE_KEYS.PROXIES, JSON.stringify(initialProxies));
      localStorage.setItem(STORAGE_KEYS.TARGETING, JSON.stringify(defaultTargeting));
      localStorage.setItem(STORAGE_KEYS.AUTOMATION, JSON.stringify(defaultAutomation));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(initialLogs));
      localStorage.setItem(STORAGE_KEYS.SELECTED_ACC_ID, initialAccounts[0]?.id || '');
    } catch (e) {
      console.warn('Storage restore defaults error:', e);
    }
    return {
      accounts: initialAccounts,
      proxies: initialProxies,
      targeting: defaultTargeting,
      automation: defaultAutomation,
      logs: initialLogs,
      selectedAccountId: initialAccounts[0]?.id || null,
    };
  }
};
