export type ActionType = 'like' | 'comment' | 'follow' | 'unfollow' | 'story' | 'dm' | 'warmup' | 'system';

export type AccountStatus = 'active' | 'warming_up' | 'paused' | 'verification_needed';

export type SafetyPreset = 'safe' | 'moderate' | 'aggressive' | 'custom';

export interface DailyMetrics {
  likes: number;
  comments: number;
  follows: number;
  unfollows: number;
  stories: number;
  dms: number;
}

export interface InstagramAccount {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  following: number;
  postsCount: number;
  status: AccountStatus;
  warmUpDay: number;
  warmUpTotalDays: number;
  proxyId: string;
  safetyPreset: SafetyPreset;
  dailyActions: DailyMetrics;
  dailyLimits: DailyMetrics;
  activeHours: { start: string; end: string };
  delayRange: [number, number]; // seconds
  lastActive: string;
}

export interface ProxyConfig {
  id: string;
  name: string;
  type: 'HTTP' | 'HTTPS' | 'SOCKS5';
  host: string;
  port: number;
  username?: string;
  password?: string;
  status: 'online' | 'untested' | 'offline';
  latencyMs: number;
  location: string;
  ip: string;
  lastChecked: string;
}

export interface TargetingConfig {
  hashtags: string[];
  competitorAccounts: string[];
  locations: string[];
  exploreFeed: boolean;
  postCommenters: string[];
  filters: {
    minFollowers: number;
    maxFollowers: number;
    hasProfilePic: boolean;
    hasBio: boolean;
    minPosts: number;
    accountType: 'all' | 'personal' | 'business';
    skipPrivate: boolean;
  };
}

export interface KeywordTrigger {
  id: string;
  keyword: string;
  postDescription: string;
  commentReply: string;
  directMessage: string;
  active: boolean;
  triggerCount: number;
}

export interface AutomationConfig {
  likePosts: boolean;
  likesPerProfile: number;
  commentPosts: boolean;
  commentsSpintax: string[];
  followUsers: boolean;
  unfollowUsers: boolean;
  unfollowAfterDays: number;
  unfollowOnlyNonFollowers: boolean;
  whitelist: string[];
  viewStories: boolean;
  likeStories: boolean;
  reactPolls: boolean;
  welcomeDmEnabled: boolean;
  welcomeDmMessage: string;
  keywordTriggers: KeywordTrigger[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actionType: ActionType;
  targetUser: string;
  detail: string;
  status: 'success' | 'delayed' | 'skipped' | 'warning';
  targetPostThumbnail?: string;
}

export interface GrowthDataPoint {
  date: string;
  followers: number;
  actions: number;
  dmsSent: number;
}
